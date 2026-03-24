using Supabase;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Models;
using DTOs;
using Classes;
using Interfaces;
using Services;

namespace Services;

public class IdeaInput : IIdeaInput
{

    string status_reference = "Active";
    
    private readonly Supabase.Client _supabaseClient;
    private readonly AIConn _aiConn;
    public IdeaInput(Supabase.Client supabaseClient, AIConn aiConn)
    {
        _supabaseClient = supabaseClient;
        _aiConn = aiConn;
    }

    public async Task<List<AnswersDTO>> GetIdeaByStatus(string status)
    {

        return new List<AnswersDTO>();
        /*
        var taskPost = await _supabaseClient
        .From<AnalysisSession>()
        .Where(t => t.Status == status )
        .Get();

        return taskPost.Models.Select(c => new AnswersDTO()
        {
          status = c.Status,
          answer = c.Idea

        }).ToList();
        */

    }

    public async Task<AnalysisResult> GetAnalysisResultBySessionId(Guid sessionId)
    {
        var response = await _supabaseClient
            .From<AnalysisResult>()
            .Where(x => x.SessionId == sessionId)
            .Get();

        return response.Models.FirstOrDefault();
    }


    public async Task<Guid> InputTextIdea(AnswersDTO input_answer)
    {
        var session = new AnalysisSession
        {
            Id = Guid.NewGuid(),
            Idea = input_answer.answer,
            Status = status_reference
        };

        var response = await _supabaseClient
            .From<AnalysisSession>()
            .Insert(session);

        var savedSession = response.Models?.FirstOrDefault() ?? session;

        // Insert initial analysis result with processing status
        var initialAnalysisResult = new AnalysisResult
        {
            Id = Guid.NewGuid(),
            SessionId = savedSession.Id,
            Score = null,
            FullAnalysis = "",
            IdeaTitle = input_answer.answer.Length > 100 ? input_answer.answer[..100] + "..." : input_answer.answer,
            MarketSize = null,
            Cagr = null,
            Roi = null,
            BreakEvenMonths = null,
            CustomerAcquisitionCost = null,
            LifetimeValue = null,
            Status = "processing",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var insertResponse = await _supabaseClient
            .From<AnalysisResult>()
            .Insert(initialAnalysisResult);

        // Use the response from insert, not the object we created
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
                Console.WriteLine($"AI Response received: {aiResponse}");

                if (string.IsNullOrWhiteSpace(aiResponse))
                {
                    throw new Exception("AI returned empty response");
                }

                string marketSize = null;
                decimal? cagr = null;
                decimal? roi = null;
                int? breakEvenMonths = null;
                decimal? customerAcquisitionCost = null;
                decimal? lifetimeValue = null;
                string analysisStatus = "completed"; // Default to completed - salvaremos a resposta sempre

                // Try to parse structured data, but don't fail if it doesn't work
                try
                {
                    Console.WriteLine("Attempting to parse JSON response...");
                    using var doc = JsonDocument.Parse(aiResponse);
                    var root = doc.RootElement;
                    Console.WriteLine("JSON parsed successfully");

                    // Parse market analysis
                    if (root.TryGetProperty("marketAnalysis", out var marketAnalysis))
                    {
                        if (marketAnalysis.TryGetProperty("marketSize", out var marketSizeObj))
                        {
                            if (marketSizeObj.TryGetProperty("current", out var current))
                            {
                                marketSize = current.GetString();
                                Console.WriteLine($"Market Size: {marketSize}");
                            }
                            if (marketSizeObj.TryGetProperty("cagr", out var cagrVal))
                            {
                                cagr = cagrVal.GetDecimal();
                                Console.WriteLine($"CAGR: {cagr}");
                            }
                        }
                    }

                    // Parse financials
                    if (root.TryGetProperty("financials", out var financials))
                    {
                        if (financials.TryGetProperty("roi", out var roiVal))
                        {
                            roi = roiVal.GetDecimal();
                            Console.WriteLine($"ROI: {roi}");
                        }
                        if (financials.TryGetProperty("breakEvenPoint", out var breakEven))
                        {
                            if (breakEven.TryGetProperty("months", out var months))
                            {
                                breakEvenMonths = months.GetInt32();
                                Console.WriteLine($"Break Even Months: {breakEvenMonths}");
                            }
                        }
                    }

                    // Parse marketing and sales
                    if (root.TryGetProperty("marketingAndSales", out var marketingAndSales))
                    {
                        if (marketingAndSales.TryGetProperty("customerAcquisitionCost", out var cac))
                        {
                            customerAcquisitionCost = cac.GetDecimal();
                            Console.WriteLine($"CAC: {customerAcquisitionCost}");
                        }
                        if (marketingAndSales.TryGetProperty("lifetimeValue", out var ltv))
                        {
                            lifetimeValue = ltv.GetDecimal();
                            Console.WriteLine($"LTV: {lifetimeValue}");
                        }
                    }

                    Console.WriteLine("Analysis data extracted successfully");
                }
                catch (JsonException ex)
                {
                    // Resposta não é JSON estritamente válido, mas ainda salvamos como texto
                    Console.WriteLine($"JSON Parse Warning (non-critical): {ex.Message}");
                    Console.WriteLine($"Will save as raw text: {aiResponse.Substring(0, Math.Min(100, aiResponse.Length))}...");
                    // analysisStatus permanece como "completed", vamos gravar a resposta bruta
                }

                // ALWAYS update the analysis result with the full_analysis response
                Console.WriteLine("⏱️ Updating database with full analysis...");
                
                try
                {
                    // Obter registro atualizado do banco para garantir sincronização
                    Console.WriteLine($"📥 Fetching record from database (ID: {savedAnalysisResult.Id})");
                    var getResponse = await _supabaseClient
                        .From<AnalysisResult>()
                        .Where(x => x.Id == savedAnalysisResult.Id)
                        .Single();

                    if (getResponse == null)
                    {
                        throw new Exception($"❌ Record not found in database after insert! ID: {savedAnalysisResult.Id}");
                    }

                    Console.WriteLine("✅ Record found in database");

                    // ATUALIZAR PROPRIEDADES
                    getResponse.FullAnalysis = aiResponse;
                    getResponse.MarketSize = marketSize;
                    getResponse.Cagr = cagr;
                    getResponse.Roi = roi;
                    getResponse.BreakEvenMonths = breakEvenMonths;
                    getResponse.CustomerAcquisitionCost = customerAcquisitionCost;
                    getResponse.LifetimeValue = lifetimeValue;
                    getResponse.Status = analysisStatus;
                    getResponse.UpdatedAt = DateTime.UtcNow;

                    Console.WriteLine($"📊 Saving with FullAnalysis length: {aiResponse.Length} characters, Status: {analysisStatus}");

                    // UPDATE NO BANCO
                    var updateResponse = await _supabaseClient
                        .From<AnalysisResult>()
                        .Where(x => x.Id == getResponse.Id)
                        .Update(getResponse);

                    Console.WriteLine($"✅ Database update successful - Updated record: {getResponse.Id}");
                    Console.WriteLine($"   - FullAnalysis saved: {(getResponse.FullAnalysis?.Length > 0 ? "YES" : "NO")}");
                    Console.WriteLine($"   - Status: {getResponse.Status}");
                    Console.WriteLine($"   - Market Size: {getResponse.MarketSize ?? "NULL"}");
                    Console.WriteLine($"   - CAGR: {getResponse.Cagr ?? 0}");
                    Console.WriteLine($"   - ROI: {getResponse.Roi ?? 0}");
                }
                catch (Exception updateEx)
                {
                    Console.WriteLine($"❌ CRITICAL: Database update failed - {updateEx.Message}");
                    Console.WriteLine($"   Stack: {updateEx.StackTrace}");
                    throw;
                }

                // Atualizar session status
                try
                {
                    var sessionResponse = await _supabaseClient
                        .From<AnalysisSession>()
                        .Where(x => x.Id == savedSession.Id)
                        .Single();

                    if (sessionResponse != null)
                    {
                        sessionResponse.Status = analysisStatus == "completed" ? "Completed" : "Error";
                        await _supabaseClient
                            .From<AnalysisSession>()
                            .Where(x => x.Id == sessionResponse.Id)
                            .Update(sessionResponse);
                        Console.WriteLine($"✅ Session status updated to: {sessionResponse.Status}");
                    }
                }
                catch (Exception sessionEx)
                {
                    Console.WriteLine($"⚠️ Warning: Session update failed - {sessionEx.Message}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 CRITICAL ERROR in AI analysis: {ex.Message}");
                Console.WriteLine($"   Stack trace: {ex.StackTrace}");

                try
                {
                    // Obter e atualizar registro de erro
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
                        Console.WriteLine("✅ Error status saved to database");
                    }
                }
                catch (Exception dbEx)
                {
                    Console.WriteLine($"❌ Failed to save error status: {dbEx.Message}");
                }

                try
                {
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
                catch (Exception sessionEx)
                {
                    Console.WriteLine($"⚠️ Failed to update session error status: {sessionEx.Message}");
                }
            }
        });

        return savedSession.Id;
    }

}