using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Interfaces;

namespace Classes;

public class AIConn : GetAIResponseAsync
{
    private readonly string _apiKey;
    private readonly HttpClient _httpClient;

    public AIConn(IConfiguration configuration)
    {
        _apiKey = configuration["OpenAI:ApiKey"];
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
    }

    public async Task<string> GetAIResponseAsync(string prompt)
    {
        var requestBody = new
        {
            model = "gpt-4-turbo",
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            max_tokens = 3500
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException($"Erro na API do OpenAI: {response.StatusCode}");
        }

        var responseJson = await response.Content.ReadAsStringAsync();
        var responseObject = JsonSerializer.Deserialize<JsonElement>(responseJson);

        // Extrair o conteúdo da resposta
        var choices = responseObject.GetProperty("choices");
        var firstChoice = choices[0];
        var message = firstChoice.GetProperty("message");
        var aiResponse = message.GetProperty("content").GetString() ?? string.Empty;

        Console.WriteLine($"Raw AI Response: {aiResponse.Substring(0, Math.Min(150, aiResponse.Length))}...");
        var cleanedResponse = CleanJsonFromResponse(aiResponse);

        return cleanedResponse;
    }

    private string CleanJsonFromResponse(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        var clean = text.Trim();

        // First, try to extract JSON from markdown code blocks
        var fenceMatch = Regex.Match(clean, "```(?:json)?\\s*(.*?)\\s*```", RegexOptions.Singleline | RegexOptions.IgnoreCase);
        if (fenceMatch.Success)
        {
            clean = fenceMatch.Groups[1].Value.Trim();
            Console.WriteLine($"Extracted JSON from markdown fence: {clean.Substring(0, Math.Min(100, clean.Length))}...");
            return clean;
        }

        // If no markdown fence, try to find JSON object
        if (clean.StartsWith("{"))
        {
            // JSON already starts with {, validate it's complete
            Console.WriteLine($"JSON starts with brace, keeping as-is: {clean.Substring(0, Math.Min(100, clean.Length))}...");
            return clean;
        }

        // If JSON doesn't start with {, try to find it
        if (clean.Contains("{"))
        {
            var start = clean.IndexOf('{');
            var end = clean.LastIndexOf('}');
            if (start >= 0 && end > start)
            {
                clean = clean.Substring(start, end - start + 1).Trim();
                Console.WriteLine($"Extracted JSON from text: {clean.Substring(0, Math.Min(100, clean.Length))}...");
                return clean;
            }
        }

        // Remove any remaining markdown fence markers
        clean = clean.Replace("```", string.Empty).Trim();
        Console.WriteLine($"Cleaned JSON (removed fences): {clean.Substring(0, Math.Min(100, clean.Length))}...");
        
        return clean;
    }
}