using DTOs;

namespace Interfaces;

public interface IAuthService
{

    Task<(bool, Guid)> Login(LoginDTO loginUser);
    
    //Task<(bool, Guid)> IsUserAuthenticatedWithId(LoginDTO loginUser);
    
    Task<bool> RegisterUser(CreateUserDTO userRegister);
    Task<Users?> GetUserById(Guid userId);
}
