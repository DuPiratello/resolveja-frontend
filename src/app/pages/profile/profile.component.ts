import { Component, OnInit } from '@angular/core';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia';
import { DenunciasCardsComponent } from '../../components/denuncias-cards/denuncias-cards.component';
import { AuthService } from '../../services/auth.service'; // Serviço de autenticação (se existir)
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [DenunciasCardsComponent, RouterModule]
})
export class ProfileComponent implements OnInit {
  minhasDenuncias: Denuncia[] = [];
  nomeUsuario: string = ''; // Propriedade para armazenar o nome do usuário

  constructor(private denunciaService: DenunciaService, private authService: AuthService) {}

  ngOnInit(): void {
    this.carregarMinhasDenuncias(); 
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
}
