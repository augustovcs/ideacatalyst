

using DTOs;

namespace Interfaces;

public interface GetAIResponseAsync
{

    Task<string> GetAIResponseAsync(string prompt);
    

}
