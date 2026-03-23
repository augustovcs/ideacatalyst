using Supabase;
using System;
using System.Threading.Tasks;
using Models;
using DTOs;
using Interfaces;
using Services;

namespace Services;

public class IdeaInput : IIdeaInput
{

    string status_reference = "Active";
    
    private readonly Supabase.Client _supabaseClient;

    public IdeaInput(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
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


    public async Task<bool> InputTextIdea(AnswersDTO input_answer)
    {
        var newInput = new AnalysisSession
        {

            Idea = input_answer.answer,
            Status = status_reference
        
        };

        var response = await _supabaseClient
            .From<AnalysisSession>()
            .Insert(newInput);

        var prompt = new TreatPrompt();
        prompt.GeneratePrompt(input_answer.answer);
        

        return response.Models != null && response.Models.Any();
    }



}