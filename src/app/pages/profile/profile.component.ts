import { Component, OnInit } from '@angular/core';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia';
import { DenunciasCardsComponent } from '../../components/denuncias-cards/denuncias-cards.component';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [DenunciasCardsComponent, RouterModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  minhasDenuncias: Denuncia[] = [];
  nomeUsuario: string = '';
  usuario: Usuario | null = null;
  telefoneEdit: string = '';
  fotoPreview: string | ArrayBuffer | null = null;
  fotoFile: File | null = null;
  modalAberto = false;
  isAdmin: boolean = false;


  constructor(
    private denunciaService: DenunciaService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.carregarMinhasDenuncias();
    this.carregarUsuario();
  }

  carregarMinhasDenuncias(): void {
    this.denunciaService.getMinhasDenuncias().subscribe({
      next: (data) => {
        this.minhasDenuncias = data;
      },
      error: (err) => {
        console.error('Erro ao carregar denúncias:', err);
      }
    });
  }

  carregarUsuario(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.usuarioService.getUsuarioById(userId).subscribe({
        next: (usuario: Usuario) => {
          this.usuario = usuario;
          this.nomeUsuario = usuario.nome || usuario.username || usuario.name || '';
          this.telefoneEdit = usuario.telefone || '';
          this.isAdmin = usuario.role === 'admin';
        },
        error: (err: any) => {
          console.error('Erro ao buscar usuário:', err);
        }
      });
    }
  }

  abrirModalEdicao() {
    this.modalAberto = true;
    this.fotoPreview = this.usuario?.fotoUrl || null;
    this.fotoFile = null;
    this.telefoneEdit = this.usuario?.telefone || '';
  }

  fecharModalEdicao() {
    this.modalAberto = false;
    this.fotoPreview = null;
    this.fotoFile = null;
  }

  onFotoSelecionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fotoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result;
      };
      reader.readAsDataURL(this.fotoFile);
    }
  }

  onTelefoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.telefoneEdit = input.value;
  }

  salvarEdicao() {
    if (!this.usuario) return;
    const formData = new FormData();
    formData.append('telefone', this.telefoneEdit);
    if (this.fotoFile) {
      formData.append('foto', this.fotoFile);
    }
    this.usuarioService.atualizarUsuario(this.usuario.id, formData).subscribe({
      next: (usuarioAtualizado: Usuario) => {
        this.usuario = usuarioAtualizado;
        this.fecharModalEdicao();
        this.nomeUsuario = usuarioAtualizado.nome || usuarioAtualizado.username || usuarioAtualizado.name || '';
      }
    });
  }

  getFotoUrl(): string {
    if (this.usuario?.fotoUrl) {
      // Se já começa com http, retorna direto
      if (this.usuario.fotoUrl.startsWith('http')) return this.usuario.fotoUrl;
      // Se não, monta a URL completa do backend
      return 'http://localhost:5000' + this.usuario.fotoUrl;
    }
    return 'assets/defaultProfile.png';
  }
  
}