using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using DTOs;
using Interfaces;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDTO dto)
    {
        if (string.IsNullOrEmpty(dto.Name) ||
            string.IsNullOrEmpty(dto.Email) ||
            string.IsNullOrEmpty(dto.Password))
        {
            return BadRequest(new { message = "Nome, email e senha são obrigatórios" });
        }

        var result = await _authService.RegisterUser(dto);

        if (!result)
            return BadRequest(new { message = "Erro ao registrar usuário" });

        return Ok(new { message = "Usuário criado com sucesso" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        if (dto == null ||
            string.IsNullOrEmpty(dto.Email) ||
            string.IsNullOrEmpty(dto.Password))
        {
            return BadRequest(new { message = "Email e senha são obrigatórios" });
        }

        var (isAuthenticated, userId) = await _authService.Login(dto);

        if (!isAuthenticated || userId == Guid.Empty)
            return Unauthorized(new { message = "Credenciais inválidas" });

        var user = await _authService.GetUserById(userId);

        if (user == null)
            return Unauthorized(new { message = "Usuário não encontrado" });

        var userDto = new UserResponseDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            IsAdmin = user.IsAdmin == 1,
            ApiAccessEnabled = user.ApiAccessEnabled,
            IsActive = user.IsActive,
            IsVerified = user.IsVerified,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt
        };

        return Ok(new
        {
            user = userDto,
            message = "Login realizado com sucesso"
        });
    }
}