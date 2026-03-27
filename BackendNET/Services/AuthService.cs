using Supabase;
using System;
using System.Threading.Tasks;
using System.Text;
using System.Security.Cryptography;
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
            {
                Console.WriteLine("Supabase login returned no user.");
                return await FallbackLogin(loginUser);
            }

            if (!Guid.TryParse(session.User.Id, out var userId))
            {
                Console.WriteLine($"Supabase login user ID inválido: {session.User.Id}");
                return await FallbackLogin(loginUser);
            }

            Console.WriteLine($"Supabase login success, userId={userId}");
            return (true, userId);
        }
        catch (Supabase.Gotrue.Exceptions.GotrueException gotrueEx)
        {
            Console.WriteLine($"Supabase login failed: {gotrueEx.Message}");
            return await FallbackLogin(loginUser);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Login error: {ex.Message}");
            return await FallbackLogin(loginUser);
        }
    }

    private async Task<(bool, Guid)> FallbackLogin(LoginDTO loginUser)
    {
        try
        {
            var hashedPassword = ComputeSha256Hash(loginUser.Password);

            var users = await _supabaseClient
                .From<Users>()
                .Where(u => u.Email == loginUser.Email)
                .Get();

            var user = users.Models.FirstOrDefault();
            if (user != null && user.PasswordHash == hashedPassword)
            {
                return (true, user.Id);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Fallback login error: {ex.Message}");
        }

        return (false, Guid.Empty);
    }

    private static string ComputeSha256Hash(string rawData)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(rawData));
        return Convert.ToHexString(bytes);
    }

    public async Task<(bool, Guid)> IsUserAuthenticatedWithId(LoginDTO loginUser)
    {
        // Método legado. Usa Login() para comportamento unificado.
        return await Login(loginUser);
    }

    public async Task<bool> RegisterUser(CreateUserDTO userRegister)
    {
        // 1. Cria no Auth do Supabase
        var signUp = await _supabaseClient.Auth.SignUp(
            userRegister.Email,
            userRegister.Password
        );

        if (signUp?.User == null)
            return false;

        var authUser = signUp.User;

        var user = new Users
        {
            Id = Guid.Parse(authUser.Id),

            Name = userRegister.Name,
            Email = userRegister.Email,

            PasswordHash = ComputeSha256Hash(userRegister.Password),

            IsAdmin = 0,
            ApiAccessEnabled = false,

            IsActive = true,
            IsVerified = authUser.EmailConfirmedAt != null,

            FailedLoginAttempts = 0,

            CreatedAt = DateTime.UtcNow,
            CreatedUpdatedAt = DateTime.UtcNow
        };

        // 3. Insere no banco
        var response = await _supabaseClient
            .From<Users>()
            .Insert(user);

        return response.Models.Count > 0;
    }
}