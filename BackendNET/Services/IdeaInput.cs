using Supabase;
using System;
using System.Threading.Tasks;
using Models;
using DTOs;
using Interfaces;

namespace Services;

public class IdeaInput : IIdeaInput
{

    string status_reference = "Active";
    
    private readonly Supabase.Client _supabaseClient;

    public IdeaInput(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
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


        return response.Models != null && response.Models.Any();
    }



}