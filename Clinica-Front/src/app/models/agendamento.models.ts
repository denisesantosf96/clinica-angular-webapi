export interface Agendamento {
  id: number;
  idTipoAtendimento: number;
  idPaciente: number;
  dataHora: Date;
  dataHoraConfirmacao?: Date | null;
  estevePresente: boolean;
}