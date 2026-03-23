using DTOs;
using Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace Controllers;

[ApiController]
[Route("api/output")]
public class GetDataInputController : ControllerBase
{
    
    public readonly IGetOutput _ideaOutput;
    public GetDataInputController(IGetOutput ideaOutput)
    {
        _ideaOutput = ideaOutput;
    }

    [HttpGet("ideabyid")]
    public async Task<IActionResult> GetIdeaAnswer()
    {

        var response = await _ideaOutput.GetOutputIdea(Guid.Parse("1f9a8c1a-4f96-484c-a253-64cdefa5b382"));
        return Ok(response);

    }

}