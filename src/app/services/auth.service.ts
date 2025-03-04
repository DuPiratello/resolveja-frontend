import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; // URL da API Flask

  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }
  
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token); // Salva o token no localStorage
  }

  getToken(): string | null {
    return localStorage.getItem('access_token'); // Obtém o token salvo
  }

  logout() {
    localStorage.removeItem('access_token'); // Remove o token do localStorage
  }
}
