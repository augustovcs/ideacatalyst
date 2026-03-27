using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

[Table("users")]
public class Users : BaseModel
{
    [PrimaryKey("id")]
    public Guid Id { get; set; }

    [Column("name")]
    public string Name { get; set; }

    [Column("email")]
    public string Email { get; set; }

    [Column("password_hash")]
    public string? PasswordHash { get; set; }

    [Column("is_admin")]
    public int IsAdmin { get; set; }

    [Column("api_access_enabled")]
    public bool ApiAccessEnabled { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; }

    [Column("is_verified")]
    public bool IsVerified { get; set; }

    [Column("failed_login_attempts")]
    public int FailedLoginAttempts { get; set; }

    [Column("last_login_at")]
    public DateTime? LastLoginAt { get; set; }

    [Column("last_login_ip")]
    public string? LastLoginIp { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }

    [Column("deleted_at")]
    public DateTime? DeletedAt { get; set; }
}