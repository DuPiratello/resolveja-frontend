import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule] // ✅ Importando ReactiveFormsModule
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
  
      const { username, email, password } = this.registerForm.value;
  
      this.authService.register(username, email, password).subscribe(
        () => {
          alert('Cadastro realizado com sucesso! Faça login.');
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.status === 409) {  // 🔥 Se der conflito (usuário já existe)
            this.errorMessage = "Usuário ou e-mail já cadastrado!";
          } else {
            this.errorMessage = "Erro ao cadastrar. Tente novamente.";
          }
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
    }
  }
}  
