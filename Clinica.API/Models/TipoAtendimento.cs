namespace Clinica.API.Models
{
    public class TipoAtendimento
    {
        public int Id { get; set; }
        public int IdClinica { get; set; }
        public int IdEspecialidade { get; set; }
        public int IdMedico { get; set; }
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
    }

}
