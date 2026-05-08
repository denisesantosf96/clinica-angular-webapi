using System.Collections.Generic;
using Clinica.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Clinica.API.Repository
{
    public class AppDbContext : DbContext
    {
        private readonly string _connectionString;
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Agendamento> Agendamentos { get; set; }
        public DbSet<Models.Clinica> Clinicas { get; set; }
        public DbSet<Especialidade> Especialidades { get; set; }
        public DbSet<Medico> Medicos { get; set; }
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<TipoAtendimento> TiposAtendimentos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Agendamento>().ToTable("Agendamento");
            modelBuilder.Entity<Models.Clinica>().ToTable("Clinica");
            modelBuilder.Entity<Especialidade>().ToTable("Especialidade");
            modelBuilder.Entity<Medico>().ToTable("Medico");
            modelBuilder.Entity<Paciente>().ToTable("Paciente");
            modelBuilder.Entity<TipoAtendimento>().ToTable("TipoAtendimento");
        }

    }
}
