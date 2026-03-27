using DTOs;

namespace Interfaces;

public interface IHistoryService
{
    Task<List<HistoryItemDTO>> GetUserHistory(Guid userId);

    Task<HistoryItemDTO> GetHistoryItem(Guid itemId, Guid userId);

    Task<bool> CreateHistoryItem(Guid userId, CreateHistoryItemDTO dto);

    Task<bool> DeleteHistoryItem(Guid itemId, Guid userId);
}
