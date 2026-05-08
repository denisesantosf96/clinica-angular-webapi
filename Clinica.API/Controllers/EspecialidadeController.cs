using Clinica.API.Application.Dtos;
using Clinica.API.Models;
using Clinica.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Clinica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EspecialidadeController : Controller
    {
        private readonly AppDbContext _context;

        public EspecialidadeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Especialidade>>> Get()
        {
            var especialidades = await _context.Especialidades.ToListAsync();
            return Ok(especialidades);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Especialidade>> GetById(int id)
        {
            var especialidade = await _context.Especialidades.FindAsync(id);

            if (especialidade == null)
                return NotFound();

            return Ok(especialidade);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] EspecialidadeDto dto)
        {
            var especialidade = new Especialidade
            {
                Nome = dto.Nome,
                Tipo = dto.Tipo
            };

            _context.Especialidades.Add(especialidade);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = especialidade.Id }, especialidade);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] EspecialidadeDto dto)
        {
            var especialidade = await _context.Especialidades.FindAsync(id);

            if (especialidade == null)
                return NotFound();

            especialidade.Nome = dto.Nome;
            especialidade.Tipo = dto.Tipo;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var especialidade = await _context.Especialidades.FindAsync(id);

            if (especialidade == null)
                return NotFound();

            _context.Especialidades.Remove(especialidade);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
