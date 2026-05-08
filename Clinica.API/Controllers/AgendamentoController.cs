using Clinica.API.Application.Dtos;
using Clinica.API.Models;
using Clinica.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Clinica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgendamentoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AgendamentoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Agendamento>>> Get()
        {
            var dados = await _context.Agendamentos.ToListAsync();
            return Ok(dados);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Agendamento>> GetById(int id)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);

            if (agendamento == null)
                return NotFound();

            return Ok(agendamento);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] AgendamentoDto dto)
        {
            var agendamento = new Agendamento
            {
                IdTipoAtendimento = dto.IdTipoAtendimento,
                IdPaciente = dto.IdPaciente,
                DataHora = dto.DataHora,
                DataHoraConfirmacao = dto.DataHoraConfirmacao,
                EstevePresente = dto.EstevePresente
            };

            _context.Agendamentos.Add(agendamento);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById),
                new { id = agendamento.Id },
                agendamento);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] AgendamentoDto dto)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);

            if (agendamento == null)
                return NotFound();

            agendamento.IdTipoAtendimento = dto.IdTipoAtendimento;
            agendamento.IdPaciente = dto.IdPaciente;
            agendamento.DataHora = dto.DataHora;
            agendamento.DataHoraConfirmacao = dto.DataHoraConfirmacao;
            agendamento.EstevePresente = dto.EstevePresente;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var agendamento = await _context.Agendamentos.FindAsync(id);

            if (agendamento == null)
                return NotFound();

            _context.Agendamentos.Remove(agendamento);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}