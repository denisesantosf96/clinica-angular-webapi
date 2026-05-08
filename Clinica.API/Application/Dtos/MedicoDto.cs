namespace Clinica.API.Application.Dtos
{
    public class MedicoDto : PessoaDto
    {
        public string Especializacao { get; set; }
        public string CRM { get; set; }
    }
}
