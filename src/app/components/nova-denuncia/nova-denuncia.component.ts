import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia';
import { MapaComponent } from '../../components/mapa/mapa.component'; // Importando o componente de mapa

@Component({
  selector: 'app-nova-denuncia',
  standalone: true,
  templateUrl: './nova-denuncia.component.html',
  styleUrls: ['./nova-denuncia.component.css'],
  imports: [CommonModule, FormsModule, MapaComponent] // Importando o componente de mapa
})
export class NovaDenunciaComponent {
  @Output() denunciaSubmitted = new EventEmitter<Denuncia>();
  
  denuncia: Denuncia = {
    titulo: '',
    tipo: '',
    id: 0,
    status: 'Pendente', // Valor padrão
    endereco: '',
    descricao: '',
    usuarioFotoUrl: '',
    usuario: null,
    reportFotoUrl: null // Adicionando a propriedade fotoUrl
  };
  
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  localConfirmado: boolean = false; // Inicialmente falso

  constructor(private denunciaService: DenunciaService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Criar pré-visualização
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedFile = null;
    // Resetar o input de arquivo
    const fileInput = document.getElementById('imagem') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  submitDenuncia() {
    const formData = new FormData();
    formData.append('titulo', this.denuncia.titulo);
    formData.append('tipo', this.denuncia.tipo);
    formData.append('status', this.denuncia.status);
    formData.append('endereco', this.denuncia.endereco);
    formData.append('descricao', this.denuncia.descricao);

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.denunciaService.criarDenuncia(formData).subscribe({
      next: (denunciaCriada) => {
        this.denunciaSubmitted.emit(denunciaCriada);
        this.resetForm();
        alert('Denúncia registrada com sucesso!');
        window.location.reload();
      },
      error: (erro) => {
        console.error('Erro ao enviar denúncia:', erro);
        alert('Ocorreu um erro ao enviar a denúncia. Por favor, tente novamente.');
      }
    });
  }

  novaDenuncia(titulo: string, tipo: string): void {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('tipo', tipo);
    formData.append('status', 'Pendente'); // Status padrão
    formData.append('endereco', this.denuncia.endereco); // Coordenadas 
    this.denunciaService.criarDenuncia(formData).subscribe({
      next: (novaDenuncia) => {
        console.log('Denúncia criada:', novaDenuncia);
        // Atualize a lista de denúncias ou redirecione o usuário
      },
      error: (err) => {
        console.error('Erro ao criar denúncia:', err);
      }
    });
  }

  private resetForm() {
    this.denuncia = {
    titulo: '',
    tipo: '',
    id: 0,
    status: 'Pendente',
    endereco: '',
    descricao: '',
    usuarioFotoUrl: '',
    usuario: null,
    reportFotoUrl: null // Resetando a fotoUrl
  };
    this.removeImage();
  }
  
  atualizarCoordenadas(coords: { lat: number; lng: number }) {
    this.denuncia.endereco = `${coords.lat},${coords.lng}`;
    this.localConfirmado = true; // Atualiza para verdadeiro quando o local é confirmado
    console.log('Coordenadas atualizadas no formulário:', this.denuncia.endereco);
  }

  resetLocalConfirmado() {
    this.localConfirmado = false; // Reseta caso o usuário selecione outro local
  }
}
