using Supabase;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Models;
using DTOs;
using Classes;
using Interfaces;

namespace Services;

public class IdeaInput : IIdeaInput
{
    private readonly string _statusReference = "Active";
    private readonly Supabase.Client _supabaseClient;
    private readonly AIConn _aiConn;
    private readonly IHistoryService _historyService;

    public IdeaInput(Supabase.Client supabaseClient, AIConn aiConn, IHistoryService historyService)
    {
        _supabaseClient = supabaseClient;
        _aiConn = aiConn;
        _historyService = historyService;
    }

    public async Task<List<AnswersDTO>> GetIdeaByStatus(string status)
    {
        return new List<AnswersDTO>();
    }

    public async Task<AnalysisResult> GetAnalysisResultBySessionId(Guid sessionId)
    {
        var response = await _supabaseClient
            .From<AnalysisResult>()
            .Where(x => x.SessionId == sessionId)
            .Get();

        return response.Models.FirstOrDefault();
    }

    public async Task<Guid> InputTextIdea(AnswersDTO input_answer, Guid userId)
    {
        var session = new AnalysisSession
        {
            Id = Guid.NewGuid(),
            Idea = input_answer.answer,
            Status = _statusReference
        };

        var response = await _supabaseClient
            .From<AnalysisSession>()
            .Insert(session);

        var savedSession = response.Models?.FirstOrDefault() ?? session;

        var initialAnalysisResult = new AnalysisResult
        {
            Id = Guid.NewGuid(),
            SessionId = savedSession.Id,
            UserId = userId,
            Score = null,
            FullAnalysis = "",
            IdeaTitle = input_answer.answer.Length > 100
                ? input_answer.answer[..100] + "..."
                : input_answer.answer,
            Status = "processing",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var insertResponse = await _supabaseClient
            .From<AnalysisResult>()
            .Insert(initialAnalysisResult);

        var savedAnalysisResult = insertResponse.Models?.FirstOrDefault() ?? initialAnalysisResult;
        Console.WriteLine($"✅ Analysis result inserted with ID: {savedAnalysisResult.Id}");

        var prompt = new TreatPrompt();
        var fullPrompt = prompt.GeneratePrompt(input_answer.answer);

        _ = Task.Run(async () =>
        {
            try
            {
                Console.WriteLine("Starting AI analysis...");
                var aiResponse = await _aiConn.GetAIResponseAsync(fullPrompt);

                if (string.IsNullOrWhiteSpace(aiResponse))
                    throw new Exception("AI returned empty response");

                // ================================
                // PARSE JSON
                // ================================
                string marketSize = null;
                decimal? cagr = null, roi = null, customerAcquisitionCost = null, lifetimeValue = null;
                int? breakEvenMonths = null;
                string analysisStatus = "completed";

                try
                {
                    using var doc = JsonDocument.Parse(aiResponse);
                    var root = doc.RootElement;

                    if (root.TryGetProperty("marketAnalysis", out var marketAnalysis))
                    {
                        if (marketAnalysis.TryGetProperty("marketSize", out var marketSizeObj))
                        {
                            if (marketSizeObj.TryGetProperty("current", out var current))
                                marketSize = current.GetString();
                            if (marketSizeObj.TryGetProperty("cagr", out var cagrVal))
                                cagr = cagrVal.GetDecimal();
                        }
                    }

                    if (root.TryGetProperty("financials", out var financials))
                    {
                        if (financials.TryGetProperty("roi", out var roiVal))
                            roi = roiVal.GetDecimal();
                        if (financials.TryGetProperty("breakEvenPoint", out var breakEven))
                            if (breakEven.TryGetProperty("months", out var months))
                                breakEvenMonths = months.GetInt32();
                    }

                    if (root.TryGetProperty("marketingAndSales", out var marketing))
                    {
                        if (marketing.TryGetProperty("customerAcquisitionCost", out var cac))
                            customerAcquisitionCost = cac.GetDecimal();
                        if (marketing.TryGetProperty("lifetimeValue", out var ltv))
                            lifetimeValue = ltv.GetDecimal();
                    }
                }
                catch (JsonException ex)
                {
                    Console.WriteLine($"JSON Parse Warning: {ex.Message}");
                }

                // ================================
                // ATUALIZA analysis_results
                // ================================
                var record = await _supabaseClient
                    .From<AnalysisResult>()
                    .Where(x => x.Id == savedAnalysisResult.Id)
                    .Single();

                if (record == null)
                    throw new Exception($"Record not found: {savedAnalysisResult.Id}");

                record.FullAnalysis = aiResponse;
                record.MarketSize = marketSize;
                record.Cagr = cagr;
                record.Roi = roi;
                record.BreakEvenMonths = breakEvenMonths;
                record.CustomerAcquisitionCost = customerAcquisitionCost;
                record.LifetimeValue = lifetimeValue;
                record.Status = analysisStatus;
                record.UpdatedAt = DateTime.UtcNow;

                await _supabaseClient
                    .From<AnalysisResult>()
                    .Where(x => x.Id == record.Id)
                    .Update(record);

                Console.WriteLine($"✅ analysis_results atualizado: {record.Id}");

                // ================================
                // CRIA HISTÓRICO ← NOVO
                // ================================
                await _historyService.CreateHistoryItem(userId, new CreateHistoryItemDTO
                {
                    IdeaDescription = input_answer.answer,
                    AnalysisResult = aiResponse,
                    SessionId = savedSession.Id.ToString(),
                    WasMock = false
                });

                Console.WriteLine($"✅ Histórico criado para userId: {userId}");

                // ================================
                // ATUALIZA session status
                // ================================
                var sessionRecord = await _supabaseClient
                    .From<AnalysisSession>()
                    .Where(x => x.Id == savedSession.Id)
                    .Single();

                if (sessionRecord != null)
                {
                    sessionRecord.Status = "Completed";
                    await _supabaseClient
                        .From<AnalysisSession>()
                        .Where(x => x.Id == sessionRecord.Id)
                        .Update(sessionRecord);

                    Console.WriteLine($"✅ Session status: Completed");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 ERRO na análise: {ex.Message}");

                try
                {
                    var errorRecord = await _supabaseClient
                        .From<AnalysisResult>()
                        .Where(x => x.Id == savedAnalysisResult.Id)
                        .Single();

                    if (errorRecord != null)
                    {
                        errorRecord.Status = "error";
                        errorRecord.ErrorMessage = ex.Message;
                        errorRecord.UpdatedAt = DateTime.UtcNow;

                        await _supabaseClient
                            .From<AnalysisResult>()
                            .Where(x => x.Id == errorRecord.Id)
                            .Update(errorRecord);
                    }

                    var sessionError = await _supabaseClient
                        .From<AnalysisSession>()
                        .Where(x => x.Id == savedSession.Id)
                        .Single();

                    if (sessionError != null)
                    {
                        sessionError.Status = "Error";
                        await _supabaseClient
                            .From<AnalysisSession>()
                            .Where(x => x.Id == sessionError.Id)
                            .Update(sessionError);
                    }
                }
                catch (Exception dbEx)
                {
                    Console.WriteLine($"❌ Falha ao salvar erro: {dbEx.Message}");
                }
            }
        });

        return savedSession.Id;
    }
}