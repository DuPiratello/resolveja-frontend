import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const publicRoutes = ['register', 'login'];
    const currentRoute = route.routeConfig?.path;

    if (publicRoutes.includes(currentRoute || '')) {
      return true;
    }

    // Se não estiver autenticado, redireciona para o login
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Se for dashboard, exige admin
    if (currentRoute === 'dashboard') {
      const role = this.authService.getUserRole();
      if (role !== 'admin') {
        this.router.navigate(['/']);
        return false;
      }
    }

    // Usuário autenticado e autorizado
    return true;
  }
}
