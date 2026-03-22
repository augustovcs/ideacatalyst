using DTOs;
using Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace Controllers;

[ApiController]
[Route("api/input")]
public class InputTextController : ControllerBase
{
    
    public readonly IIdeaInput _ideainput;
    public InputTextController(IIdeaInput ideaInput)
    {
        _ideainput = ideaInput;
    }


    [HttpPost("idea")]
    public async Task<IActionResult> InputIdea ([FromBody] AnswersDTO idea)
    {
        var answer_response =  await _ideainput.InputTextIdea(idea);

         // LOGS
        Console.WriteLine($"Idea registered: {idea.answer}");
        return Ok(new
        {
            message = "Idea registered successfully",
            idea.answer,
            idea.status,
            idea.created_at
        });

    }


}