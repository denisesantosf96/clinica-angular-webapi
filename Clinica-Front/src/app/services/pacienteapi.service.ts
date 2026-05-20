import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente.models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  baseURL: string = 'https://localhost:7251/api/paciente';

  constructor(private http: HttpClient) { }

  salvar(paciente: Paciente) {
    return this.http.post<Paciente>(this.baseURL, paciente);
  }

  atualizar(paciente: Paciente) {
    return this.http.put(`${this.baseURL}/${paciente.id}`, paciente);
  }

  deletar(id: number)  {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  pesquisarPacientes(nomeBusca: string): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.baseURL).pipe(
        map((pacientes: Paciente[]) => {
        if (!nomeBusca) return pacientes;

        return pacientes.filter(c =>
            c.nome?.toLowerCase().includes(nomeBusca.toLowerCase())
        );
        })
    );
  }

  buscarPacientePorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.baseURL}/${id}`);
  }

}