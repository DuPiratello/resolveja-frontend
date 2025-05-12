import { Component, Input } from '@angular/core';
import { Denuncia } from '../../models/denuncia'; 

@Component({
  selector: 'app-denuncias-cards',
  templateUrl: './denuncias-cards.component.html',
  styleUrls: ['./denuncias-cards.component.css']
})
export class DenunciasCardsComponent {
  @Input() denunciasFiltradas!: Denuncia[];
}
