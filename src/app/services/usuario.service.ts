import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  role: string;
  telefone: string;
  id: string;
  nome?: string;
  username?: string;
  name?: string;
  fotoUrl?: string;
  // outros campos conforme seu backend
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5000/usuarios'; // ajuste conforme sua API

  constructor(private http: HttpClient) {}

  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  atualizarUsuario(id: string, data: FormData): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, data);
  }
}