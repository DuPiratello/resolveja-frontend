import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements AfterViewInit {
  map: L.Map | undefined;

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    // Configura o mapa (ex: Sorocaba como centro)
    this.map = L.map('map').setView([-23.5016, -47.4581], 13);

    // Adiciona o tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);

    // Dados de exemplo (array de [lat, lng, intensity])
    const heatData: [number, number, number][] = [
      [-23.5016, -47.4581, 0.8],  // Sorocaba - alta intensidade
      [-23.5100, -47.4500, 0.5],  // Região próxima
      [-23.4950, -47.4650, 0.3],  // Outra área
      [-23.5200, -47.4400, 0.6]   // Mais um ponto
    ];

    // Cria o mapa de calor
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
  }
}