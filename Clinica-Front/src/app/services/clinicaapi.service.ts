import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clinica } from '../models/clinica.models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {

  baseURL: string = 'https://localhost:7251/api/clinica';

  constructor(private http: HttpClient) { }

  salvar(clinica: Clinica) {
    return this.http.post<Clinica>(this.baseURL, clinica);
  }

  atualizar(clinica: Clinica) {
    return this.http.put(`${this.baseURL}/${clinica.id}`, clinica);
  }

  deletar(id: number)  {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  pesquisarClinicas(nomeBusca: string): Observable<Clinica[]> {
  return this.http.get<Clinica[]>(this.baseURL).pipe(
    map((clinicas: Clinica[]) => {
      if (!nomeBusca) return clinicas;

      return clinicas.filter(c =>
        c.nome?.toLowerCase().includes(nomeBusca.toLowerCase())
      );
    })
  );
}

  buscarClinicaPorId(id: number): Observable<Clinica> {
    return this.http.get<Clinica>(`${this.baseURL}/${id}`);
  }

}