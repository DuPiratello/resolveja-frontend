import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { getApiUrl } from './environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  showNavigation = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    if (this.authService.getToken()) {
      this.http.get(`${this.getApiUrl()}/auth/protected`).subscribe(
        (response) => console.log('✅ Sucesso:', response),
        (error) => console.log('❌ Erro ao acessar API protegida:', error)
      );
    } else {
      console.log("🔹 Usuário não autenticado, ignorando chamada à API protegida.");
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getApiUrl(): string {
    return getApiUrl();
  }
}