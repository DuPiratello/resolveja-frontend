import { Component, AfterViewInit, inject } from '@angular/core';
import { DenunciaService } from '../../services/denuncia.service'; // ajuste o caminho se necessário

@Component({
  selector: 'app-graphs',
  standalone: true,
  imports: [],
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements AfterViewInit {
  private denunciaService = inject(DenunciaService);

  denuncias: any[] = [];

  ngAfterViewInit() {
    (window as any).google.charts.load('current', { packages: ['corechart'] });
    (window as any).google.charts.setOnLoadCallback(() => {
      this.denunciaService.getDenuncias().subscribe(data => {
        this.denuncias = data;
        this.drawCharts();
      });
    });
  }

  drawCharts() {
    // Inicializa os contadores
    const tipos: { [key: string]: number } = { 'Buraco': 0, 'Iluminação': 0, 'Lixo': 0 };
    const status: { [key: string]: number } = { 'Pendente': 0, 'Em Andamento': 0, 'Resolvido': 0 };

    this.denuncias.forEach(d => {
      // Padroniza tipo
      const tipo = (d.tipo || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (tipo === 'buraco') tipos['Buraco']++;
      else if (tipo === 'iluminacao' || tipo === 'iluminacao') tipos['Iluminação']++;
      else if (tipo === 'lixo') tipos['Lixo']++;

      // Padroniza status
      const stat = (d.status || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (stat === 'pendente') status['Pendente']++;
      else if (stat === 'em andamento') status['Em Andamento']++;
      else if (stat === 'resolvido') status['Resolvido']++;
    });

    // Gráfico de Pizza
    const pieData = (window as any).google.visualization.arrayToDataTable([
      ['Tipo', 'Quantidade'],
      ['Buraco', tipos['Buraco']],
      ['Iluminação', tipos['Iluminação']],
      ['Lixo', tipos['Lixo']]
    ]);
    const pieOptions = { title: 'Denúncias por Tipo', width: 400, height: 300 };
    const pieChart = new (window as any).google.visualization.PieChart(document.getElementById('piechart'));
    pieChart.draw(pieData, pieOptions);

    // Gráfico de Barras
    const barData = (window as any).google.visualization.arrayToDataTable([
      ['Status', 'Quantidade'],
      ['Pendente', status['Pendente']],
      ['Em Andamento', status['Em Andamento']],
      ['Resolvido', status['Resolvido']]
    ]);
    const barOptions = { title: 'Denúncias por Status', width: 400, height: 300, legend: { position: 'none' } };
    const barChart = new (window as any).google.visualization.ColumnChart(document.getElementById('barchart'));
    barChart.draw(barData, barOptions);
  }
}