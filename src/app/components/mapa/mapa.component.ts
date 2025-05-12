import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css',
})
export class MapaComponent implements AfterViewInit {
@Output() localConfirmadoEvent = new EventEmitter<{ lat: number; lng: number }>();
@Output() localResetEvent = new EventEmitter<void>();

  map!: L.Map;
  selectedCoords: { lat: number; lng: number } | null = null;
  marker: L.Marker | null = null;
  localConfirmado: boolean = false;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([-23.5016, -47.4581], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.localConfirmado) return;

      this.selectedCoords = { lat: e.latlng.lat, lng: e.latlng.lng };

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker(e.latlng).addTo(this.map);
      console.log('Selecionado:', this.selectedCoords);
    });
  }

  confirmarLocal() {
    if (this.marker) {
      const coords = this.marker.getLatLng();
      this.selectedCoords = { lat: coords.lat, lng: coords.lng };
      this.localConfirmado = true;
  
      console.log('📍 Local confirmado:');
      console.log(`Latitude: ${this.selectedCoords.lat}`);
      console.log(`Longitude: ${this.selectedCoords.lng}`);
      
       // Emite as coordenadas confirmadas para o componente pai
    this.localConfirmadoEvent.emit(this.selectedCoords);
    }
  }
  

  redefinirLocal() {
    this.localConfirmado = false;
    this.selectedCoords = null;

    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }

    this.localResetEvent.emit(); // Emite o evento para o componente pai
  }
}
