import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Medico } from '../models/medico.models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  baseURL: string = 'https://localhost:7251/api/medico';

  constructor(private http: HttpClient) { }

  salvar(medico: Medico) {
    return this.http.post<Medico>(this.baseURL, medico);
  }

  atualizar(medico: Medico) {
    return this.http.put(`${this.baseURL}/${medico.id}`, medico);
  }

  deletar(id: number)  {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  pesquisarMedicos(nomeBusca: string): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.baseURL).pipe(
        map((medicos: Medico[]) => {
        if (!nomeBusca) return medicos;

        return medicos.filter(c =>
            c.nome?.toLowerCase().includes(nomeBusca.toLowerCase())
        );
        })
    );
  }

  buscarMedicoPorId(id: number): Observable<Medico> {
    return this.http.get<Medico>(`${this.baseURL}/${id}`);
  }

}