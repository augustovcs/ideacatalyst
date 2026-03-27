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

    // ================================
    // LOGIN
    // ================================
    public async Task<(bool, Guid)> Login(LoginDTO loginUser)
    {
        try
        {
            var session = await _supabaseClient.Auth.SignIn(loginUser.Email, loginUser.Password);

            if (session?.User == null)
            {
                Console.WriteLine("[Login] Supabase retornou sessão nula.");
                return (false, Guid.Empty);
            }

            if (!Guid.TryParse(session.User.Id, out var userId))
            {
                Console.WriteLine("[Login] ID do Supabase inválido.");
                return (false, Guid.Empty);
            }

            _supabaseClient.Auth.SetSession(session.AccessToken, session.RefreshToken);

            var user = await GetUserById(userId);

            if (user != null)
            {
                await UpdateLastLogin(userId);
                return (true, userId);
            }

            // Usuário autenticado no Supabase mas não existe na public.users — cria
            Console.WriteLine($"[Login] Usuário {userId} não encontrado na public.users — criando.");
            await CreatePublicUser(userId, loginUser.Email, loginUser.Email);

            return (true, userId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Login] ERRO: {ex.Message}");
            return (false, Guid.Empty);
        }
    }

    // ================================
    // REGISTER
    // ================================
    public async Task<bool> RegisterUser(CreateUserDTO dto)
    {
        try
        {
            var signUp = await _supabaseClient.Auth.SignUp(dto.Email, dto.Password);

            if (signUp?.User == null)
            {
                Console.WriteLine("[Register] Supabase retornou usuário nulo.");
                return false;
            }

            if (!Guid.TryParse(signUp.User.Id, out var userId))
            {
                Console.WriteLine("[Register] ID do Supabase inválido.");
                return false;
            }

            // Se já existe na public.users com ID errado, remove
            var existing = await GetUserByEmail(dto.Email);
            if (existing != null && existing.Id != userId)
            {
                Console.WriteLine($"[Register] Removendo registro duplicado com ID errado: {existing.Id}");
                await _supabaseClient
                    .From<Users>()
                    .Where(u => u.Email == dto.Email)
                    .Delete();
                existing = null;
            }

            if (existing == null)
                await CreatePublicUser(userId, dto.Email, dto.Name);

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Register] ERRO: {ex.Message}");
            return false;
        }
    }

    // ================================
    // QUERIES
    // ================================
    public async Task<Users?> GetUserById(Guid userId)
    {
        try
        {
            var response = await _supabaseClient
                .From<Users>()
                .Where(u => u.Id == userId)
                .Get();

            return response.Models.FirstOrDefault();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GetUserById] ERRO: {ex.Message}");
            return null;
        }
    }

    public async Task<Users?> GetUserByEmail(string email)
    {
        try
        {
            var response = await _supabaseClient
                .From<Users>()
                .Where(u => u.Email == email)
                .Get();

            return response.Models.FirstOrDefault();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GetUserByEmail] ERRO: {ex.Message}");
            return null;
        }
    }

    // ================================
    // HELPERS PRIVADOS
    // ================================
    private async Task CreatePublicUser(Guid userId, string email, string name)
    {
        var newUser = new Users
        {
            Id = userId,
            Name = name,
            Email = email,
            PasswordHash = "SUPABASE_AUTH",
            IsAdmin = 0,
            ApiAccessEnabled = false,
            IsActive = true,
            IsVerified = true,
            FailedLoginAttempts = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _supabaseClient
        .From<Users>()
        .Upsert(newUser);
        Console.WriteLine($"[CreatePublicUser] Usuário criado: {userId} / {email}");
    }

    private async Task UpdateLastLogin(Guid userId)
    {
        try
        {
            await _supabaseClient
                .From<Users>()
                .Where(u => u.Id == userId)
                .Set(u => u.LastLoginAt, DateTime.UtcNow)
                .Set(u => u.UpdatedAt, DateTime.UtcNow)
                .Update();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[UpdateLastLogin] ERRO: {ex.Message}");
        }
    }
}