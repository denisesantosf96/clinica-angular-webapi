using Clinica.API.Repository;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class TesteController : ControllerBase
{
    private readonly AppDbContext _context;

    public TesteController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var dados = _context.Clinicas.ToList();
        return Ok(dados);
    }
}