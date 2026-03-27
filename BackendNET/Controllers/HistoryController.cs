using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DTOs;
using Interfaces;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _historyService;

    public HistoryController(IHistoryService historyService)
    {
        _historyService = historyService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserHistory(Guid userId)
    {
        var history = await _historyService.GetUserHistory(userId);
        return Ok(history);
    }

    [HttpGet("item/{itemId}/{userId}")]
    public async Task<IActionResult> GetHistoryItem(Guid itemId, Guid userId)
    {
        var item = await _historyService.GetHistoryItem(itemId, userId);
        if (item == null)
            return NotFound("Item não encontrado");

        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> CreateHistoryItem([FromBody] CreateHistoryItemDTO dto, [FromQuery] Guid userId)
    {
        if (string.IsNullOrEmpty(dto.IdeaDescription) || string.IsNullOrEmpty(dto.AnalysisResult))
            return BadRequest("Descrição da ideia e resultado são obrigatórios");

        var result = await _historyService.CreateHistoryItem(userId, dto);

        if (!result)
            return StatusCode(500, "Erro ao salvar análise no histórico");

        return Ok(new { message = "Análise salva com sucesso" });
    }

    [HttpDelete("{itemId}/{userId}")]
    public async Task<IActionResult> DeleteHistoryItem(Guid itemId, Guid userId)
    {
        var result = await _historyService.DeleteHistoryItem(itemId, userId);

        if (!result)
            return StatusCode(500, "Erro ao deletar análise");

        return Ok(new { message = "Análise deletada com sucesso" });
    }
}
