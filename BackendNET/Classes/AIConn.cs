using System.Net.Http;
using System.Text;
using System.Text.Json;
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
            model = "gpt-4o",
            messages = new[]
            {
                new { role = "user", content = prompt }
            },
            max_tokens = 2000
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
        var aiResponse = message.GetProperty("content").GetString();


        Console.WriteLine(aiResponse);
        return aiResponse;
    }
}