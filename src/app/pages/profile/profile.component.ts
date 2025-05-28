import { Component, OnInit } from '@angular/core';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia';
import { DenunciasCardsComponent } from '../../components/denuncias-cards/denuncias-cards.component';
import { AuthService } from '../../services/auth.service'; // Serviço de autenticação (se existir)
import { RouterModule } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service'; // Serviço de usuário

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [DenunciasCardsComponent, RouterModule] // Importa o componente de cartões de denúncias e o RouterModule
})
export class ProfileComponent implements OnInit {
  minhasDenuncias: Denuncia[] = [];
  nomeUsuario: string = ''; // Propriedade para armazenar o nome do usuário

  constructor(
    private denunciaService: DenunciaService, 
    private authService: AuthService, 
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.carregarMinhasDenuncias();
    this.carregarNomeUsuario(); 
  }
  carregarMinhasDenuncias(): void {
    this.denunciaService.getMinhasDenuncias().subscribe({
      next: (data) => {
        console.log('Minhas denúncias carregadas:', data);
        this.minhasDenuncias = data;
      },
      error: (err) => {
        console.error('Erro ao carregar denúncias:', err);
      }
    });
  }
  carregarNomeUsuario(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.usuarioService.getUsuarioById(userId).subscribe({
        next: (usuario: Usuario) => {
          console.log('Usuário retornado:', usuario);
          this.nomeUsuario = usuario.nome || usuario.username || usuario.name || '';
        },
        error: (err: any) => {
          console.error('Erro ao buscar usuário:', err);
        }
      });
    }
  }
}import { from } from 'rxjs';

