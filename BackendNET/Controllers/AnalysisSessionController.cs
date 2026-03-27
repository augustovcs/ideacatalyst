using DTOs;
using Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace Controllers;

[ApiController]
[Route("api/input")]
public class InputTextController : ControllerBase
{
    
    public readonly IIdeaInput _ideainput;
    public InputTextController(IIdeaInput ideaInput)
    {
        _ideainput = ideaInput;
    }

    [HttpGet("ideabystatus")]
    public async Task<IActionResult> GetIdeaByStatus()
    {

        var response = await _ideainput.GetIdeaByStatus("Active");
        return Ok(response);

    }

    [HttpGet("analysis/{sessionId}")]
    public async Task<IActionResult> GetAnalysisResult(Guid sessionId)
    {
        var result = await _ideainput.GetAnalysisResultBySessionId(sessionId);
        if (result == null)
        {
            return NotFound("Analysis result not found");
        }

        var dto = new AnalysisResultDTO
        {
            id = result.Id,
            sessionId = result.SessionId,
            score = result.Score,
            fullAnalysis = result.FullAnalysis,
            ideaTitle = result.IdeaTitle,
            marketSize = result.MarketSize,
            cagr = result.Cagr,
            roi = result.Roi,
            breakEvenMonths = result.BreakEvenMonths,
            customerAcquisitionCost = result.CustomerAcquisitionCost,
            lifetimeValue = result.LifetimeValue,
            status = result.Status,
            errorMessage = result.ErrorMessage,
            createdAt = result.CreatedAt,
            updatedAt = result.UpdatedAt
        };

        return Ok(dto);
    }


   [HttpPost("idea")]
    public async Task<IActionResult> InputIdea([FromBody] AnswersDTO idea, [FromQuery] Guid userId)
    {
        if (userId == Guid.Empty)
            return BadRequest(new { message = "userId é obrigatório" });

        var sessionId = await _ideainput.InputTextIdea(idea, userId);


          if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); // 🔥 ISSO AQUI
        }
        return Ok(new
        {
            message = "Idea registered successfully",
            sessionId,
            idea.idea,
            idea.status,
            idea.created_at
        });
    }


}