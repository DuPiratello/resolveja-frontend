import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Denuncia } from '../models/denuncia';
import { getApiUrl } from '../environment';


@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  private apiUrl = `${getApiUrl()}/api`;

  constructor(private http: HttpClient) { }

  criarDenuncia(denuncia: FormData): Observable<Denuncia> {
    
    return this.http.post<Denuncia>(`${this.apiUrl}/denuncias`, denuncia);
  }
  getDenuncias(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(`${this.apiUrl}/denuncias`);
  }
  getMinhasDenuncias() {
    return this.http.get<Denuncia[]>(`${this.apiUrl}/minhas-denuncias`);
  }
  getCoordenadas(): Observable<[number, number, number][]> {
    return this.http.get<[number, number, number][]>(`${this.apiUrl}/coordenadas`);
  }
  atualizarDenuncia(denuncia: Denuncia): Observable<Denuncia> {
    return this.http.put<Denuncia>(
      `${this.apiUrl}/denuncias/${denuncia.id}`,
      denuncia,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  getCoordenadasAtivas(): Observable<[number, number, number][]> {
    return this.http.get<[number, number, number][]>(`${this.apiUrl}/coordenadas-ativas`);
  }
  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard`);
  }
}
