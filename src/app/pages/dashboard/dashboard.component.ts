import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NovaDenunciaComponent } from '../../components/nova-denuncia/nova-denuncia.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, NovaDenunciaComponent]
})
export class DashboardComponent implements OnInit {
  denuncias: Denuncia[] = [];
  denunciasFiltradas: Denuncia[] = [];
  selectedStatus = '';
  selectedTipo = '';
  isopen: boolean = false;

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

  novaDenuncia() {
    this.isopen = true;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}