export interface Clinica {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  numero: number | null;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  cep: string;
  deletando?: boolean;
}