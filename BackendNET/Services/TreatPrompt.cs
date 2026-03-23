using System;
using System.IO;
using System.Threading.Tasks;

namespace Services;

public class TreatPrompt
{
    public string GeneratePrompt(string answer)
    {
        string promptFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "Resources", "promptgen.md");

        string promptTemplate = File.ReadAllText(promptFilePath);

        // Substitui o placeholder pelo answer
        string fullPrompt = promptTemplate.Replace("{INSERIR_IDEA_AQUI}", answer);

        //Console.WriteLine(fullPrompt);
        return fullPrompt;
    }
}