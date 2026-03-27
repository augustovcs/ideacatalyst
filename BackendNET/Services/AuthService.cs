using Supabase;
using System;
using System.Linq;
using System.Threading.Tasks;
using DTOs;
using Interfaces;
using Models;

namespace Services;

public class AuthService : IAuthService
{
    private readonly Supabase.Client _supabaseClient;

    public AuthService(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
    }

    public async Task<(bool, Guid)> Login(LoginDTO loginUser)
    {
        try
        {
            var session = await _supabaseClient.Auth.SignIn(
                loginUser.Email,
                loginUser.Password
            );

            if (session?.User == null)
                return (false, Guid.Empty);

            _supabaseClient.Auth.SetSession(session.AccessToken, session.RefreshToken);

            if (!Guid.TryParse(session.User.Id, out var userId))
                return (false, Guid.Empty);

            // 🔥 GARANTE QUE USUÁRIO EXISTE NA TABELA
            var user = await GetUserById(userId);

            if (user != null)
                return (true, userId);

            // 🔥 tenta por email
            user = await GetUserByEmail(loginUser.Email);

            if (user != null)
            {
                // recria com ID correto
                await _supabaseClient
                    .From<Users>()
                    .Where(u => u.Email == loginUser.Email)
                    .Delete();

                var fixedUser = new Users
                {
                    Id = userId,
                    Email = loginUser.Email,
                    Name = user.Name ?? loginUser.Email,
                    PasswordHash = "SUPABASE_AUTH",

                    IsAdmin = user.IsAdmin,
                    ApiAccessEnabled = user.ApiAccessEnabled,
                    IsActive = true,
                    IsVerified = true,

                    FailedLoginAttempts = user.FailedLoginAttempts,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = DateTime.UtcNow
                };

                await _supabaseClient.From<Users>().Insert(fixedUser);

                return (true, userId);
            }

            // 🔥 cria novo
            var newUser = new Users
            {
                Id = userId,
                Email = loginUser.Email,
                Name = loginUser.Email,
                PasswordHash = "SUPABASE_AUTH",

                IsAdmin = 0,
                ApiAccessEnabled = false,
                IsActive = true,
                IsVerified = true,

                FailedLoginAttempts = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _supabaseClient.From<Users>().Insert(newUser);

            return (true, userId);
        }
        catch (Exception ex)
        {   
            Console.WriteLine($"[AuthService.Login] ERRO: {ex.Message}");
            return (false, Guid.Empty);
        }
    }

    public async Task<bool> RegisterUser(CreateUserDTO dto)
    {
        try
        {
            var signUp = await _supabaseClient.Auth.SignUp(dto.Email, dto.Password);

            if (signUp?.User == null)
                return false;

            if (!Guid.TryParse(signUp.User.Id, out var userId))
                return false;

            // remove duplicado se existir
            var existing = await GetUserByEmail(dto.Email);
            if (existing != null)
            {
                await _supabaseClient
                    .From<Users>()
                    .Where(u => u.Email == dto.Email)
                    .Delete();
            }

            var newUser = new Users
            {
                Id = userId,
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = "SUPABASE_AUTH",

                IsAdmin = 0,
                ApiAccessEnabled = false,
                IsActive = true,
                IsVerified = signUp.User.EmailConfirmedAt != null,

                FailedLoginAttempts = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _supabaseClient.From<Users>().Insert(newUser);

            return true;
        }
        catch
        {
            return false;
        }
    }

    // 🔥 MÉTODOS CENTRALIZADOS

    public async Task<Users?> GetUserById(Guid userId)
    {
        var response = await _supabaseClient
            .From<Users>()
            .Where(u => u.Id == userId)
            .Get();

        return response.Models.FirstOrDefault();
    }

    public async Task<Users?> GetUserByEmail(string email)
    {
        var response = await _supabaseClient
            .From<Users>()
            .Where(u => u.Email == email)
            .Get();

        return response.Models.FirstOrDefault();
    }
}