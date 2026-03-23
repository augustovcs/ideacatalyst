

using DTOs;

namespace Interfaces;

public interface IGetOutput
{

    Task<AnswersDTO> GetOutputIdea(Guid id);
    

}
