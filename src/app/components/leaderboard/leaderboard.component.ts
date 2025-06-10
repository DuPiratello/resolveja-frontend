import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DenunciaService } from '../../services/denuncia.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];
  loading = true;
  error = '';

  constructor(private denunciaService: DenunciaService) {}

  ngOnInit() {
    this.denunciaService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar leaderboard';
        this.loading = false;
      }
    });
  }
}