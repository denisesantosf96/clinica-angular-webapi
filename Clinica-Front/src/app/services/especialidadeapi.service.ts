import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Especialidade } from '../models/especialidade.models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {

  baseURL: string = 'https://localhost:7251/api/especialidade';

  constructor(private http: HttpClient) { }

  salvar(especialidade: Especialidade) {
    return this.http.post<Especialidade>(this.baseURL, especialidade);
  }

  atualizar(especialidade: Especialidade) {
    return this.http.put(`${this.baseURL}/${especialidade.id}`, especialidade);
  }

  deletar(id: number)  {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  pesquisarEspecialidades(nomeBusca: string): Observable<Especialidade[]> {
    return this.http.get<Especialidade[]>(this.baseURL).pipe(
        map((especialidades: Especialidade[]) => {
        if (!nomeBusca) return especialidades;

        return especialidades.filter(c =>
            c.nome?.toLowerCase().includes(nomeBusca.toLowerCase())
        );
        })
    );
  }

  buscarEspecialidadePorId(id: number): Observable<Especialidade> {
    return this.http.get<Especialidade>(`${this.baseURL}/${id}`);
  }

}