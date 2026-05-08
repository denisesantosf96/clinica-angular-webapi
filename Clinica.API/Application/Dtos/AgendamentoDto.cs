namespace Clinica.API.Application.Dtos
{
    public class AgendamentoDto
    {
        public int Id { get; set; }
        public int IdTipoAtendimento { get; set; }
        public int IdPaciente { get; set; }
        public DateTime DataHora { get; set; } = DateTime.Now;
        public DateTime? DataHoraConfirmacao { get; set; }
        public bool EstevePresente { get; set; }
    }
}
