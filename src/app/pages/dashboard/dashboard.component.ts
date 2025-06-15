import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DenunciasCardsComponent } from '../../components/denuncias-cards/denuncias-cards.component'; // Importando o componente de mapa
import { HeatmapComponent } from '../../components/heatmap/heatmap.component';  
import { RouterModule } from '@angular/router';
import { GraphsComponent } from '../../components/graphs/graphs.component';
import { LeaderboardComponent } from '../../components/leaderboard/leaderboard.component';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, RouterModule, FormsModule, DenunciasCardsComponent, HeatmapComponent, GraphsComponent, LeaderboardComponent] // Importando o componente de mapa
})
export class DashboardComponent implements OnInit {
  denuncias: Denuncia[] = [];
  denunciasFiltradas: Denuncia[] = [];
  selectedStatus = '';
  selectedTipo = '';
  isOpen: boolean = false;
  selectedDenuncia: Denuncia | null = null;
  imagemExpandida = false;



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
    );
  }
  
    get taxaResolucao(): number {
      if (!this.denuncias || this.denuncias.length === 0) return 0;
      return Math.round((this.denunciasResolvidas.length / this.denuncias.length) * 100);
    }

  atualizarStatus(novoStatus: string) {
    if (!this.selectedDenuncia) return;
    const denunciaAtualizada = { ...this.selectedDenuncia, status: novoStatus };
    this.denunciaService.atualizarDenuncia(denunciaAtualizada).subscribe({
      next: (data) => {
        // Atualiza localmente
        const idx = this.denuncias.findIndex(d => d.id === denunciaAtualizada.id);
        if (idx > -1) this.denuncias[idx] = denunciaAtualizada;
        this.filtrarDenuncias();
        this.selectedDenuncia = denunciaAtualizada;
      },
      error: (err) => {
        console.error('Erro ao atualizar status:', err);
      }
    });
  }

  toggleNovaDenuncia() {
    this.isOpen = !this.isOpen; // Alterna entre true e false
  }
  
  abrirDetalhes(denuncia: Denuncia) {
    this.selectedDenuncia = { ...denuncia };
  }

  fecharDetalhes() {
    this.selectedDenuncia = null;
  }

    get denunciasPendentes() {
    return this.denuncias.filter(d => d.status === 'pendente' || d.status === 'Pendente');
  }

    get denunciasResolvidas() {
    return this.denuncias.filter(d => d.status === 'resolvido');
  }

  getReportFotoUrl(denuncia: any): string {
    if (denuncia.reportFotoUrl) {
      if (denuncia.reportFotoUrl.startsWith("http")) return denuncia.reportFotoUrl
      return this.getApiUrl() + denuncia.reportFotoUrl
    }
    return "assets/defaultProfile.png"
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getApiUrl(): string {
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

    return isLocal ? 'http://localhost:5000' : 'https://resolveja-backend-134601635282.southamerica-east1.run.app';
  }

}