import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;  // 👈 Agora como string (números sem máscara)
  cpf: string;    // 👈 Agora como string (números sem máscara)
}

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; // URL da API Flask

  constructor(private http: HttpClient) {}

  // Registro com tratamento de erros
  register(userData: RegisterData): Observable<any> {
    // Garante que phone e cpf são strings numéricas (já tratadas no componente)
    const payload = {
      ...userData,
      phone: userData.phone.replace(/\D/g, ''),
      cpf: userData.cpf.replace(/\D/g, '')
    };

    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      catchError(this.handleError) // 👈 Tratamento centralizado de erros
    );
  }

  // Login com tipagem clara
  login(credentials: LoginData): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  // Salva o token com verificação
  saveToken(token: string): void {
    if (token) {
      localStorage.setItem('access_token', token);
    }
  }

  // Obtém o token com tipo de retorno definido
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Logout com limpeza garantida
  logout(): void {
    localStorage.removeItem('access_token');
  }

  // Tratamento centralizado de erros HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = `Código ${error.status}: ${error.error.message || error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}