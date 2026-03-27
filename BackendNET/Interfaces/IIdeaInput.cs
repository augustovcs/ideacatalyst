/*

Defined the packages and libraries for project usage below,
Keep just the "using" as already injected for better memory economy and usage.
For first time looking the project, keep maintain this arc model for Interfaces.

*/


using DTOs;
using Models;

namespace Interfaces;

public interface IIdeaInput
{
    Task<List<AnswersDTO>> GetIdeaByStatus(string status);
    Task<AnalysisResult> GetAnalysisResultBySessionId(Guid sessionId);
    Task<Guid> InputTextIdea(AnswersDTO input_answer, Guid userId); // ← userId adicionado
}
