import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // ✅ Redireciona a página inicial corretamente
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // ✅ Cadastro liberado
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' } // ✅ Garante que URLs inválidas vão para o login
];
