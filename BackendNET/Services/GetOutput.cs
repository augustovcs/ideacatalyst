using Supabase;
using System;
using System.Threading.Tasks;
using Models;
using DTOs;
using Interfaces;

namespace Services;

public class GetOutput : IGetOutput
{
    
    private readonly Supabase.Client _supabaseClient;

    public GetOutput(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
    }

   public async Task<AnswersDTO?> GetOutputIdea(Guid id)
    {
        var response = await _supabaseClient
            .From<AnalysisSession>()
            .Where(t => t.Id == id)
            .Get();

        var session = response.Models.FirstOrDefault();

        if (session == null) return null;


        return new AnswersDTO
        {
            idea = session.Idea
        };
    }


}