import { Component, Input } from '@angular/core';
import { Denuncia } from '../../models/denuncia'; 

@Component({
  selector: 'app-denuncias-cards',
  templateUrl: './denuncias-cards.component.html',
  styleUrls: ['./denuncias-cards.component.css']
})
export class DenunciasCardsComponent {
  @Input() denunciasFiltradas!: Denuncia[];

getFotoUrl(denuncia: any): string {
  if (denuncia.fotoUrl) {
    if (denuncia.fotoUrl.startsWith('http')) return denuncia.fotoUrl;
    return 'http://localhost:5000' + denuncia.fotoUrl;
  }
  return 'assets/defaultProfile.png';
}
}
