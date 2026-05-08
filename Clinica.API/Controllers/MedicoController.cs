using Clinica.API.Application.Dtos;
using Clinica.API.Models;
using Clinica.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Clinica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicoController : Controller
    {
        private readonly AppDbContext _context;

        public MedicoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medico>>> Get()
        {
            var medicos = await _context.Medicos.ToListAsync();
            return Ok(medicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Medico>> GetById(int id)
        {
            var medico = await _context.Medicos.FindAsync(id);

            if (medico == null)
                return NotFound();

            return Ok(medico);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MedicoDto dto)
        {
            var medico = new Medico
            {
                Nome = dto.Nome,
                CPF = dto.CPF,
                RG = dto.RG,
                Telefone = dto.Telefone,
                Email = dto.Email,
                Endereco = dto.Endereco,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                Cidade = dto.Cidade,
                Estado = dto.Estado,
                Pais = dto.Pais,
                CEP = dto.CEP,
                DataNascimento = dto.DataNascimento,
                Especializacao = dto.Especializacao,
                CRM = dto.CRM
            };

            _context.Medicos.Add(medico);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = medico.Id }, medico);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MedicoDto dto)
        {
            var medico = await _context.Medicos.FindAsync(id);

            if (medico == null)
                return NotFound();

            medico.Nome = dto.Nome;
            medico.CPF = dto.CPF;
            medico.RG = dto.RG;
            medico.Email = dto.Email;
            medico.Telefone = dto.Telefone;
            medico.Endereco = dto.Endereco;
            medico.Numero = dto.Numero;
            medico.Complemento = dto.Complemento;
            medico.Bairro = dto.Bairro;
            medico.Cidade = dto.Cidade;
            medico.Estado = dto.Estado;
            medico.Pais = dto.Pais;
            medico.CEP = dto.CEP;
            medico.DataNascimento = dto.DataNascimento;
            medico.Especializacao = dto.Especializacao;
            medico.CRM = dto.CRM;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var medico = await _context.Medicos.FindAsync(id);

            if (medico == null)
                return NotFound();

            _context.Medicos.Remove(medico);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
