
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { DenunciaService } from '../../services/denuncia.service';

declare global {
  interface Window {
    L: any;
  }
}

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements AfterViewInit {
  map: L.Map | undefined;
  private heatLayerLoaded = false;

  constructor(private denunciaService: DenunciaService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadHeatLayerAndData();
  }

  initMap(): void {
    // Configura o mapa (ex: Sorocaba como centro)
    this.map = L.map('map').setView([-23.5016, -47.4581], 13);

    // Adiciona o tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map!);
  }

  private async loadHeatLayerAndData(): Promise<void> {
    try {
      // Tenta carregar leaflet.heat dinamicamente
      await this.loadLeafletHeat();
      this.heatLayerLoaded = true;
      console.log('leaflet.heat carregado com sucesso');
    } catch (error) {
      console.warn('Não foi possível carregar leaflet.heat:', error);
      this.heatLayerLoaded = false;
    }

    this.carregarCoordenadas();
  }

  private loadLeafletHeat(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verifica se já está carregado
      if ((L as any).heatLayer) {
        resolve();
        return;
      }

      // Tenta carregar via script tag
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.onload = () => {
        if ((L as any).heatLayer || (window.L && (window.L as any).heatLayer)) {
          resolve();
        } else {
          reject(new Error('heatLayer não encontrado após carregar script'));
        }
      };
      script.onerror = () => reject(new Error('Falha ao carregar script leaflet.heat'));
      document.head.appendChild(script);
    });
  }

  carregarCoordenadas(): void {
    this.denunciaService.getCoordenadasAtivas().subscribe({
      next: (heatData) => {
        console.log('Coordenadas ativas carregadas:', heatData);
        this.criarVisualizacao(heatData);
      },
      error: (err) => {
        console.error('Erro ao carregar coordenadas ativas:', err);
        // Fallback para coordenadas originais
        this.denunciaService.getCoordenadas().subscribe({
          next: (heatData) => {
            console.log('Usando coordenadas originais como fallback:', heatData);
            this.criarVisualizacao(heatData);
          },
          error: (fallbackErr) => {
            console.error('Erro ao carregar coordenadas:', fallbackErr);
          }
        });
      }
    });
  }

  private criarVisualizacao(heatData: any[]): void {
    if (!this.map) {
      console.error('Mapa não inicializado');
      return;
    }

    if (this.heatLayerLoaded && (L as any).heatLayer) {
      console.log('Criando mapa de calor com leaflet.heat');
      this.criarMapaDeCalor(heatData);
    } else {
      console.log('Criando visualização alternativa com marcadores');
      this.criarMarcadoresAlternativos(heatData);
    }
  }

  private criarMapaDeCalor(heatData: any[]): void {
    if (!this.map) return;

    try {
      (L as any).heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        gradient: {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red'
        }
      }).addTo(this.map!);
    } catch (error) {
      console.error('Erro ao criar mapa de calor:', error);
      this.criarMarcadoresAlternativos(heatData);
    }
  }

  private criarMarcadoresAlternativos(heatData: any[]): void {
    if (!this.map) return;

    heatData.forEach((point: any) => {
      if (point && point.length >= 2) {
        const lat = point[0];
        const lng = point[1];
        const intensity = point[2] || 1;
        
        L.circle([lat, lng], {
          color: this.getColorByIntensity(intensity),
          fillColor: this.getColorByIntensity(intensity),
          fillOpacity: 0.6,
          radius: 50 * Math.max(intensity, 0.5),
          weight: 2
        }).addTo(this.map!);
      }
    });
  }

  private getColorByIntensity(intensity: number): string {
    if (intensity <= 0.4) return '#3b82f6'; // blue
    if (intensity <= 0.6) return '#06b6d4'; // cyan
    if (intensity <= 0.7) return '#84cc16'; // lime
    if (intensity <= 0.8) return '#eab308'; // yellow
    return '#ef4444'; // red
  }
}
