import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NovaDenunciaComponent } from '../../components/nova-denuncia/nova-denuncia.component';
import { DenunciasCardsComponent } from '../../components/denuncias-cards/denuncias-cards.component'; // Importando o componente de mapa
import { HeatmapComponent } from '../../components/heatmap/heatmap.component';  
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-userpage',
  standalone: true,
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css'],
  imports: [CommonModule, RouterModule, FormsModule, NovaDenunciaComponent, DenunciasCardsComponent, HeatmapComponent] // Importando o componente de mapa
})
export class UserPageComponent implements OnInit {
  denuncias: Denuncia[] = [];
  denunciasFiltradas: Denuncia[] = [];
  selectedStatus = '';
  selectedTipo = '';
  isOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private denunciaService: DenunciaService
  ) {}

  ngOnInit(): void {
    this.carregarDenuncias();
  }

  carregarDenuncias(): void {
    this.denunciaService.getDenuncias().subscribe({
      next: (data) => {
        console.log('Denúncias carregadas:', data); // Verifique os dados no console
        this.denuncias = data;
        this.denunciasFiltradas = data;
        this.denunciasFiltradas = data.slice(0, 12);
      },
      error: (err) => {
        console.error('Erro ao carregar denúncias:', err);
      }
    });
  }

  filtrarDenuncias() {
    if (!this.denuncias) return;

    const normalizeText = (text: string) =>
      text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

    this.denunciasFiltradas = this.denuncias.filter(d =>
      (!this.selectedStatus || normalizeText(d.status || '') === normalizeText(this.selectedStatus)) &&
      (!this.selectedTipo || normalizeText(d.tipo || '') === normalizeText(this.selectedTipo))
    ).slice(0, 12);
  }

  novaDenuncia() {
    this.isOpen = true;
  }
  toggleNovaDenuncia() {
    this.isOpen = !this.isOpen; // Alterna entre true e false
  }

    get denunciasPendentes() {
    return this.denuncias.filter(d => d.status === 'pendente');
  }

  get denunciasResolvidas() {
    return this.denuncias.filter(d => d.status === 'resolvido');
  }
  get denunciasAndamento() {
  return this.denuncias.filter(d => (d.status || '').toLowerCase() === 'em andamento');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}