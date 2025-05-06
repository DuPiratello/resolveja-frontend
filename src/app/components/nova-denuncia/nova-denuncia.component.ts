import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia';

@Component({
  selector: 'app-nova-denuncia',
  standalone: true,
  templateUrl: './nova-denuncia.component.html',
  styleUrls: ['./nova-denuncia.component.css'],
  imports: [CommonModule, FormsModule]
})
export class NovaDenunciaComponent {
  @Output() denunciaSubmitted = new EventEmitter<Denuncia>();
  
  denuncia: Denuncia = {
    titulo: '',
    tipo: '',
    id: 0,
    status: 'Pendente' // Valor padrão
  };
  
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

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
    const denuncia = {
      titulo: this.denuncia.titulo,
      tipo: this.denuncia.tipo,
      status: this.denuncia.status
    };

    this.denunciaService.criarDenuncia(denuncia).subscribe({
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
    const denuncia: Partial<Denuncia> = {
      titulo: titulo,
      tipo: tipo,
      status: 'Pendente'
    };
    this.denunciaService.criarDenuncia(denuncia).subscribe({
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
      status: 'Pendente'
    };
    this.removeImage();
  }
}