import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  private denuncias = [
    { id: 1, titulo: 'Buraco na rua', tipo: 'Buraco', status: 'Pendente' },
    { id: 2, titulo: 'Lâmpada Queimada', tipo: 'Iluminação', status: 'Resolvido' }
  ];

  getDenuncias() {
    return this.denuncias;
  }
}
