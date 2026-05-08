namespace Clinica.API.Application.Dtos
{
    public class TipoAtendimentoDto
    {
        public int Id { get; set; }
        public int IdClinica { get; set; }
        public int IdEspecialidade { get; set; }
        public int IdMedico { get; set; }
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
    }
}
