namespace DTOs;



public class UpdateUserAccessDTO
{
    public bool? ApiAccessEnabled { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsVerified { get; set; }

    public int? IsAdmin { get; set; }
}


public class LoginDTO
{
    public string Email { get; set; }

    public string Password { get; set; }
}

public class CreateUserDTO
{
    public string Name { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }
}

public class UserResponseDTO
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Email { get; set; }

    public bool IsAdmin { get; set; }

    public bool ApiAccessEnabled { get; set; }

    public bool IsActive { get; set; }

    public bool IsVerified { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }
}

public class AuthResultDTO
{
    public bool Success { get; set; }

    public Guid UserId { get; set; }

    public string AccessToken { get; set; }

    public string RefreshToken { get; set; }

    public string Email { get; set; }
}