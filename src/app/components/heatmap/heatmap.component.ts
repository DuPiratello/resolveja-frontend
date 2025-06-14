import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { DenunciaService } from '../../services/denuncia.service';

// Expande o objeto window para incluir L
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
  map!: L.Map;
  private heatLoaded = false;

  constructor(private denunciaService: DenunciaService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadHeatPlugin()
      .then(() => {
        this.heatLoaded = true;
        this.carregarCoordenadas();
      })
      .catch(() => {
        console.warn('leaflet.heat não carregou, usarei marcadores.');
        this.carregarCoordenadas();
      });
  }

  private initMap(): void {
    this.map = L.map('map').setView([-23.5016, -47.4581], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  private loadHeatPlugin(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Se já foi carregado no global, resolve
      if ((window as any).L?.heatLayer) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.onload = () => {
        setTimeout(() => {
          if ((window as any).L?.heatLayer) {
            resolve();
          } else {
            reject(new Error('heatLayer não encontrado após carregar script'));
          }
        }, 100);
      };
      script.onerror = () => reject(new Error('Falha ao carregar leaflet.heat'));
      document.head.appendChild(script);
    });
  }

  private carregarCoordenadas(): void {
    this.denunciaService.getCoordenadasAtivas().subscribe({
      next: data => this.criarVisualizacao(data),
      error: () => {
        this.denunciaService.getCoordenadas().subscribe(
          data => this.criarVisualizacao(data),
          err => console.error('Não carregou coordenadas de fallback:', err)
        );
      }
    });
  }

  private criarVisualizacao(data: any[]): void {
    console.log('Dados recebidos:', data, 'heatLoaded:', this.heatLoaded);
    if (this.heatLoaded && (window as any).L?.heatLayer) {
      this.criarMapaDeCalor(data);
    } else {
      this.criarMarcadores(data);
    }
  }

  private criarMapaDeCalor(raw: any[]): void {
    if (!this.map) return;
    const points: [number, number, number][] = raw
      .map(p => {
        if (Array.isArray(p)) {
          const lat = typeof p[0] === 'number' ? p[0] : 0;
          const lng = typeof p[1] === 'number' ? p[1] : 0;
          const intensity = typeof p[2] === 'number' ? p[2] : 0.5;
          return [lat, lng, intensity] as [number, number, number];
        } else {
          const lat = typeof p.latitude === 'number' ? p.latitude : (typeof p.lat === 'number' ? p.lat : 0);
          const lng = typeof p.longitude === 'number' ? p.longitude : (typeof p.lng === 'number' ? p.lng : 0);
          const intensity = typeof p.intensity === 'number' ? p.intensity : 0.5;
          return [lat, lng, intensity] as [number, number, number];
        }
      })
      .filter(pt => pt[0] != null && pt[1] != null);
    if (!points.length) {
      console.warn('Nenhum ponto válido para heatmap');
      return;
    }
    // Usa o heatLayer do objeto global L
    (window as any).L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.2: 'blue', 0.4: 'cyan', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red' }
    }).addTo(this.map);
  }

  private criarMarcadores(raw: any[]): void {
    if (!this.map) return;
    raw.forEach(p => {
      const lat = Array.isArray(p) ? p[0] : p.latitude || p.lat;
      const lng = Array.isArray(p) ? p[1] : p.longitude || p.lng;
      const intensity = Array.isArray(p) ? (p[2] || 1) : (p.intensity || 1);
      if (lat != null && lng != null) {
        L.circle([lat, lng], {
          color: this.corPorIntensidade(intensity),
          fillColor: this.corPorIntensidade(intensity),
          fillOpacity: 0.6,
          radius: 50 * Math.max(intensity, 0.5),
          weight: 2
        }).addTo(this.map);
      }
    });
  }

  private corPorIntensidade(i: number): string {
    if (i <= 0.4) return '#3b82f6';
    if (i <= 0.6) return '#06b6d4';
    if (i <= 0.7) return '#84cc16';
    if (i <= 0.8) return '#eab308';
    return '#ef4444';
  }
}
