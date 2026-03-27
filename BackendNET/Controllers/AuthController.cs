using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DTOs;
using Interfaces;
using System.IO.Compression;
using Models;
using Supabase;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly Supabase.Client _supabaseClient;

    public AuthController(IAuthService authService, Supabase.Client supabaseClient)
    {
        _authService = authService;
        _supabaseClient = supabaseClient;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDTO dto)
    {
        if (string.IsNullOrEmpty(dto.Name) || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            return BadRequest(new { message = "Nome, email e senha são obrigatórios" });

        var result = await _authService.RegisterUser(dto);

        if (!result)
            return BadRequest(new { message = "Erro ao registrar usuário" });

        return Ok(new { message = "Usuário criado com sucesso" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dtoLogin)
    {
        if (dtoLogin == null || 
            string.IsNullOrEmpty(dtoLogin.Email) || 
            string.IsNullOrEmpty(dtoLogin.Password))
        {
            return BadRequest("Email e senha são obrigatórios");
        }

        (bool isAuthenticated, Guid userId) = await _authService.Login(dtoLogin);

        if (!isAuthenticated || userId == Guid.Empty)
            return Unauthorized(new {
                message = "Credenciais inválidas"
            });

        // Busca dados do usuário com api_access_enabled
        try
        {
            var users = await _supabaseClient
                .From<Users>()
                .Where(u => u.Id == userId)
                .Get();

            var userResponse = users.Models.FirstOrDefault();
            Console.WriteLine($"UserId vindo do auth: {userId}");
            Console.WriteLine($"Qtd users encontrados: {users.Models.Count}");

            if (userResponse == null)
                return Unauthorized(new { message = "Usuário não encontrado" });

            var userDto = new UserResponseDTO
            {
                Id = userResponse.Id,
                Name = userResponse.Name,
                Email = userResponse.Email,
                IsAdmin = userResponse.IsAdmin == 1,
                ApiAccessEnabled = userResponse.ApiAccessEnabled,
                IsActive = userResponse.IsActive,
                IsVerified = userResponse.IsVerified,
                CreatedAt = userResponse.CreatedAt,
                LastLoginAt = userResponse.LastLoginAt
            };

            return Ok(new { user = userDto, message = "Login realizado com sucesso" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro no login: {ex.Message} {ex.StackTrace}");
            return StatusCode(500, new { error = $"Erro ao buscar dados do usuário: {ex.Message}" });
        }
    }
}