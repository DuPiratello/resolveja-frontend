import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserPageComponent } from './pages/userpage/userpage.component'; // Importando o componente UserPage

export const routes: Routes = [
  { path: '', component: HomeComponent }, // ✅ Define a página inicial como HomeComponent
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // ✅ Dashboard protegido pelo AuthGuard
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]}, // ✅ Profile também protegido pelo AuthGuard
  { path: 'userpage', component: UserPageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' } // ✅ URLs inválidas redirecionam para a homepage
];
