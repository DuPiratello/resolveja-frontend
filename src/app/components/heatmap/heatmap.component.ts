
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
      console.log('leaflet.heat carregado com sucesso, heatLayer disponível:', !!(L as any).heatLayer);
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
        console.log('leaflet.heat já estava carregado');
        resolve();
        return;
      }

      console.log('Carregando leaflet.heat dinamicamente...');
      
      // Tenta carregar via script tag
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      
      script.onload = () => {
        console.log('Script leaflet.heat carregado');
        
        // Aguarda um pequeno delay para garantir que o plugin seja registrado
        setTimeout(() => {
          if ((L as any).heatLayer) {
            console.log('heatLayer encontrado no objeto L');
            resolve();
          } else if (window.L && (window.L as any).heatLayer) {
            console.log('heatLayer encontrado no window.L');
            resolve();
          } else {
            console.error('heatLayer não encontrado após carregar script');
            reject(new Error('heatLayer não encontrado após carregar script'));
          }
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('Falha ao carregar script leaflet.heat:', error);
        reject(new Error('Falha ao carregar script leaflet.heat'));
      };
      
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

    console.log('Dados do heatmap:', heatData);
    console.log('heatLayerLoaded:', this.heatLayerLoaded);
    console.log('L.heatLayer disponível?', !!(L as any).heatLayer);

    if (this.heatLayerLoaded && (L as any).heatLayer && heatData.length > 0) {
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
      // Converte os dados para o formato correto se necessário
      const formattedData = heatData.map(point => {
        if (Array.isArray(point) && point.length >= 2) {
          return [point[0], point[1], point[2] || 0.5]; // lat, lng, intensity
        }
        return [point.latitude || point.lat, point.longitude || point.lng, point.intensity || 0.5];
      }).filter(point => point[0] && point[1]); // Remove pontos inválidos

      console.log('Dados formatados para heatmap:', formattedData);

      if (formattedData.length === 0) {
        console.warn('Nenhum dado válido para o mapa de calor');
        return;
      }

      const heatLayer = (L as any).heatLayer(formattedData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.2: 'blue',
          0.4: 'cyan', 
          0.6: 'lime',
          0.8: 'yellow',
          1.0: 'red'
        }
      });

      heatLayer.addTo(this.map);
      console.log('Mapa de calor criado com sucesso');
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
