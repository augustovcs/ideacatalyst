using Supabase;
using Supabase.Postgrest;
using System;
using System.Threading.Tasks;
using DTOs;
using Interfaces;
using Models;

namespace Services;

public class HistoryService : IHistoryService
{
    private readonly Supabase.Client _supabaseClient;

    public HistoryService(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
    }

    public async Task<List<HistoryItemDTO>> GetUserHistory(Guid userId)
    {
        try
        {
            var response = await _supabaseClient
                .From<IdeaHistory>()
                .Where(h => h.UserId == userId)
                .Order("created_at", Supabase.Postgrest.Constants.Ordering.Descending)
                .Get();

            return response.Models.ConvertAll(m => MapToDTO(m));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao buscar histórico: {ex.Message}");
            return new List<HistoryItemDTO>();
        }
    }

    public async Task<HistoryItemDTO> GetHistoryItem(Guid itemId, Guid userId)
    {
        try
        {
            var response = await _supabaseClient
                .From<IdeaHistory>()
                .Where(h => h.Id == itemId && h.UserId == userId)
                .Get();

            var item = response.Models.FirstOrDefault();
            return item != null ? MapToDTO(item) : null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao buscar item de histórico: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> CreateHistoryItem(Guid userId, CreateHistoryItemDTO dto)
    {
        try
        {
            var item = new IdeaHistory
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                IdeaDescription = dto.IdeaDescription,
                AnalysisResult = dto.AnalysisResult,
                SessionId = dto.SessionId,
                WasMock = dto.WasMock,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var response = await _supabaseClient
                .From<IdeaHistory>()
                .Insert(item);

            return response.Models.Count > 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao criar item de histórico: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> DeleteHistoryItem(Guid itemId, Guid userId)
    {
        try
        {
            await _supabaseClient
                .From<IdeaHistory>()
                .Where(h => h.Id == itemId && h.UserId == userId)
                .Delete();

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao deletar item de histórico: {ex.Message}");
            return false;
        }
    }

    private HistoryItemDTO MapToDTO(IdeaHistory model)
    {
        return new HistoryItemDTO
        {
            Id = model.Id,
            IdeaDescription = model.IdeaDescription,
            AnalysisResult = model.AnalysisResult,
            SessionId = model.SessionId,
            WasMock = model.WasMock,
            CreatedAt = model.CreatedAt
        };
    }
}
