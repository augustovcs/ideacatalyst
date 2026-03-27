using Supabase;
using System;
using System.Linq;
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
                .From<AnalysisResult>()
                .Where(r => r.UserId == userId)
                .Order("created_at", Supabase.Postgrest.Constants.Ordering.Descending)
                .Get();

            return response.Models.Select(MapToDTO).ToList();
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
                .From<AnalysisResult>()
                .Where(r => r.Id == itemId && r.UserId == userId)
                .Get();

            var item = response.Models.FirstOrDefault();
            return item != null ? MapToDTO(item) : null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao buscar item: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> DeleteHistoryItem(Guid itemId, Guid userId)
    {
        try
        {
            await _supabaseClient
                .From<AnalysisResult>()
                .Where(r => r.Id == itemId && r.UserId == userId)
                .Delete();

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao deletar: {ex.Message}");
            return false;
        }
    }

    // CreateHistoryItem não é mais necessário — o IdeaInput já insere direto em analysis_results
    public Task<bool> CreateHistoryItem(Guid userId, CreateHistoryItemDTO dto) 
        => Task.FromResult(true);

    private HistoryItemDTO MapToDTO(AnalysisResult r) => new()
    {
        Id = r.Id,
        IdeaDescription = r.IdeaTitle ?? "",
        AnalysisResult = r.FullAnalysis,
        SessionId = r.SessionId,
        WasMock = false,
        CreatedAt = r.CreatedAt
    };
}