import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DashboardComponent {
  denuncias: Denuncia[] = [];
  denunciasFiltradas: Denuncia[] = [];
  selectedStatus = '';
  selectedTipo = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private denunciaService: DenunciaService
  ) {}

  ngOnInit() {
    const data = this.denunciaService.getDenuncias();
    if (Array.isArray(data)) {
      this.denuncias = data;
      this.filtrarDenuncias();
    } else {
      console.error('Erro: getDenuncias() retornou um formato inesperado:', data);
    }
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
    this.router.navigate(['/nova-denuncia']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
