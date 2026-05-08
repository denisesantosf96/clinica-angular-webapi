using Clinica.API.Application.Dtos;
using Clinica.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Clinica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClinicaController : Controller
    {
        private readonly AppDbContext _context;

        public ClinicaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.Clinica>>> Get()
        {
            var clinicas = await _context.Clinicas.ToListAsync();
            return Ok(clinicas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Models.Clinica>> GetById(int id)
        {
            var clinica = await _context.Clinicas.FindAsync(id);

            if (clinica == null)
                return NotFound();

            return Ok(clinica);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ClinicaDto dto)
        {
            var clinica = new Models.Clinica
            {
                Nome = dto.Nome,
                Telefone = dto.Telefone,
                Endereco = dto.Endereco,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                Cidade = dto.Cidade,
                Estado = dto.Estado,
                Pais = dto.Pais,
                CEP = dto.CEP
            };

            _context.Clinicas.Add(clinica);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = clinica.Id }, clinica);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] ClinicaDto dto)
        {
            var clinica = await _context.Clinicas.FindAsync(id);

            if (clinica == null)
                return NotFound();

            clinica.Nome = dto.Nome;
            clinica.Telefone = dto.Telefone;
            clinica.Endereco = dto.Endereco;
            clinica.Numero = dto.Numero;
            clinica.Complemento = dto.Complemento;
            clinica.Bairro = dto.Bairro;
            clinica.Cidade = dto.Cidade;
            clinica.Estado = dto.Estado;
            clinica.Pais = dto.Pais;
            clinica.CEP = dto.CEP;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var clinica = await _context.Clinicas.FindAsync(id);

            if (clinica == null)
                return NotFound();

            _context.Clinicas.Remove(clinica);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
