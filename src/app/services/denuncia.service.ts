import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Denuncia } from '../models/denuncia';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  private apiUrl = 'http://127.0.0.1:5000/api'; 

  constructor(private http: HttpClient) { }

  criarDenuncia(denuncia: Partial<Denuncia>): Observable<Denuncia> {
    return this.http.post<Denuncia>(`${this.apiUrl}/denuncias`, denuncia, {
      headers: { 'Content-Type': 'application/json' }
    });
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
}
