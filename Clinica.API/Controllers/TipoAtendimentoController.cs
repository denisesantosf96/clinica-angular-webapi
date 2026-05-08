using Clinica.API.Application.Dtos;
using Clinica.API.Models;
using Clinica.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Clinica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoAtendimentoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TipoAtendimentoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoAtendimento>>> Get()
        {
            var dados = await _context.TiposAtendimentos.ToListAsync();
            return Ok(dados);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TipoAtendimento>> GetById(int id)
        {
            var tipo = await _context.TiposAtendimentos.FindAsync(id);

            if (tipo == null)
                return NotFound();

            return Ok(tipo);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] TipoAtendimentoDto dto)
        {
            var tipoAtendimento = new TipoAtendimento
            {
                IdClinica = dto.IdClinica,
                IdEspecialidade = dto.IdEspecialidade,
                IdMedico = dto.IdMedico,
                Descricao = dto.Descricao,
                Valor = dto.Valor
            };

            _context.TiposAtendimentos.Add(tipoAtendimento);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = tipoAtendimento.Id }, tipoAtendimento);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] TipoAtendimentoDto dto)
        {
            var tipoAtendimento = await _context.TiposAtendimentos.FindAsync(id);

            if (tipoAtendimento == null)
                return NotFound();

            tipoAtendimento.IdClinica = dto.IdClinica;
            tipoAtendimento.IdEspecialidade = dto.IdEspecialidade;
            tipoAtendimento.IdMedico = dto.IdMedico;
            tipoAtendimento.Descricao = dto.Descricao;
            tipoAtendimento.Valor = dto.Valor;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var tipo = await _context.TiposAtendimentos.FindAsync(id);

            if (tipo == null)
                return NotFound();

            _context.TiposAtendimentos.Remove(tipo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}