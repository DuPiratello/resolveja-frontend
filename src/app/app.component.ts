import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule]
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}
  title = 'Resolve Já';

  ngOnInit() {
    this.http.get('http://localhost:5000/auth/protected').subscribe(
      (response) => console.log('Sucesso:', response),
      (error) => console.log('Erro:', error)
    );
  }
}
