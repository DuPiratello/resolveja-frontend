import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const publicRoutes = ['register', 'login']; // ✅ Define as rotas que não precisam de login
    const currentRoute = route.routeConfig?.path;

    // ✅ Se a rota for pública, libera o acesso SEM autenticação
    if (publicRoutes.includes(currentRoute || '')) {
      return true;
    }

    // ✅ Se o usuário está autenticado, permite acessar a rota protegida
    if (this.authService.getToken()) {
      return true;
    }

    // ❌ Se não estiver autenticado, redireciona para o login
    this.router.navigate(['/login']);
    return false;
  }
}
