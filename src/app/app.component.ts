import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from './environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule]
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}

  title = 'Resolve Já';

  ngOnInit() {
    if (this.authService.getToken()) {
      this.http.get(`${environment.apiUrl}/auth/protected`).subscribe(
        (response) => console.log('✅ Sucesso:', response),
        (error) => console.log('❌ Erro ao acessar API protegida:', error)
      );
    } else {
      console.log("🔹 Usuário não autenticado, ignorando chamada à API protegida.");
    }
  }
}
