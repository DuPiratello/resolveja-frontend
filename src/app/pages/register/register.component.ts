import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
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
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d \d{4}-\d{4}$/)]], // (xx) x xxxx-xxxx
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]] // xxx.xxx.xxx-xx
    });
  }

  // Formatação do telefone
  formatPhone(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 0) {
      value = `(${value.substring(0, 2)}) ${value.substring(2, 3)} ${value.substring(3, 7)}-${value.substring(7, 11)}`;
    }

    this.registerForm.get('phone')?.setValue(value, { emitEvent: false });
  }

  // Formatação do CPF
  formatCPF(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 0) {
      value = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9, 11)}`;
    }

    this.registerForm.get('cpf')?.setValue(value, { emitEvent: false });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      // Remove máscaras antes de enviar
      const formData = {
        ...this.registerForm.value,
        phone: this.registerForm.value.phone.replace(/\D/g, ''),
        cpf: this.registerForm.value.cpf.replace(/\D/g, '')
      };

      this.authService.register(formData).subscribe(
        () => {
          alert('Cadastro realizado com sucesso! Faça login.');
          this.router.navigate(['/login']);
        },
        (error) => {
          if (error.status === 409) {
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