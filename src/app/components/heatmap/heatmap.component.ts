import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import { DenunciaService } from '../../services/denuncia.service';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements AfterViewInit {
  map: L.Map | undefined;

  constructor(private denunciaService: DenunciaService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.carregarCoordenadas();
  }

  initMap(): void {
    // Configura o mapa (ex: Sorocaba como centro)
    this.map = L.map('map').setView([-23.5016, -47.4581], 13);

    // Adiciona o tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);
  }

  carregarCoordenadas(): void {
    this.denunciaService.getCoordenadas().subscribe({
      next: (heatData) => {
        console.log('Coordenadas carregadas:', heatData);

        // Cria o mapa de calor com os dados recebidos
        (L as any).heatLayer(heatData, {
          radius: 25,       // Tamanho do raio de cada ponto
          blur: 15,         // Desfoque entre os pontos
          maxZoom: 10,      // Zoom máximo onde o calor aparece
          gradient: {       // Cores do gradiente (opcional)
            0.4: 'blue',
            0.6: 'cyan',
            0.7: 'lime',
            0.8: 'yellow',
            1.0: 'red'
          }
        }).addTo(this.map);
      },
      error: (err) => {
        console.error('Erro ao carregar coordenadas:', err);
      }
    });
  }
}