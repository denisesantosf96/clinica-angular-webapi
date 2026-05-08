export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  email: string;
  endereco: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  cep: string;
  dataNascimento: Date;
}