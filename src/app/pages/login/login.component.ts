import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 💡 Importa o módulo comum

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule] // 💡 Agora o *ngIf e o formulário vão funcionar
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false; // ✅ Estado de carregamento
  errorMessage: string | null = null; // ✅ Mensagem de erro

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
  
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;      
  
      this.authService.login(email, password).subscribe(
        (response) => {
          this.authService.saveToken(response.access_token);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.errorMessage = "Credenciais inválidas. Tente novamente.";
          this.isLoading = false; // ✅ Agora o loading para quando der erro
        },
        () => {
          this.isLoading = false; // ✅ Garante que o loading para após qualquer resposta
        }
      );
    }
  }
}  

