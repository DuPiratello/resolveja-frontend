import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      return true; // Se o token existir, permite acesso
    } else {
      this.router.navigate(['/login']); // Se não estiver autenticado, redireciona para o login
      return false;
    }
  }
}
