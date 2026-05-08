using Clinica.API.Application.Dtos;
using Clinica.API.Models;
using Clinica.API.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Clinica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacienteController : Controller
    {
        private readonly AppDbContext _context;

        public PacienteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Paciente>>> Get()
        {
            var pacientes = await _context.Pacientes.ToListAsync();
            return Ok(pacientes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Paciente>> GetById(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);

            if (paciente == null)
                return NotFound();

            return Ok(paciente);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PacienteDto dto)
        {
            var paciente = new Paciente
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
                DataNascimento = dto.DataNascimento
            };

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = paciente.Id }, paciente);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] PacienteDto dto)
        {
            var paciente = await _context.Pacientes.FindAsync(id);

            if (paciente == null)
                return NotFound();

            paciente.Nome = dto.Nome;
            paciente.CPF = dto.CPF;
            paciente.RG = dto.RG;
            paciente.Email = dto.Email;
            paciente.Telefone = dto.Telefone;
            paciente.Endereco = dto.Endereco;
            paciente.Numero = dto.Numero;
            paciente.Complemento = dto.Complemento;
            paciente.Bairro = dto.Bairro;
            paciente.Cidade = dto.Cidade;
            paciente.Estado = dto.Estado;
            paciente.Pais = dto.Pais;
            paciente.CEP = dto.CEP;
            paciente.DataNascimento = dto.DataNascimento;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);

            if (paciente == null)
                return NotFound();

            _context.Pacientes.Remove(paciente);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
