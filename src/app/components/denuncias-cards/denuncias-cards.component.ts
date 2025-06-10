import { Component, Input, Output, EventEmitter } from "@angular/core"
import type { Denuncia } from "../../models/denuncia"
import { NgIf } from "@angular/common"
@Component({
  selector: "app-denuncias-cards",
  templateUrl: "./denuncias-cards.component.html",
  styleUrls: ["./denuncias-cards.component.css"],
  imports: [NgIf],
  standalone: true 
})
export class DenunciasCardsComponent {
  @Input() denunciasFiltradas!: Denuncia[]
  @Input() showDetailsButton: boolean = false
  @Output() abrir = new EventEmitter<Denuncia>()
  

  getFotoUrl(denuncia: any): string {
    if (denuncia.fotoUrl) {
      if (denuncia.fotoUrl.startsWith("http")) return denuncia.fotoUrl
      return "http://localhost:5000" + denuncia.fotoUrl
    }
    return "assets/defaultProfile.png"
  }

  // Métodos auxiliares para o novo design
  onImageError(event: any): void {
    event.target.src = "assets/defaultProfile.png"
  }

  getStatusClass(status: string): string {
    return `status-${status.replace(/\s+/g, "-").toLowerCase()}`
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case "pendente":
        return "⏳"
      case "em andamento":
        return "🔄"
      case "resolvido":
        return "✅"
      case "cancelado":
        return "❌"
      default:
        return "📋"
    }
  }

  getTipoIcon(tipo: string): string {
    switch (tipo?.toLowerCase()) {
    case 'seguranca': 
      return '🚨';
    case 'meio-ambiente': 
      return '🌱';
    case 'riscos':
       return '⚠️';
      default:
        return "📋"
    }
  }

  getNomeUsuario(denuncia: any): string {
  return (
    denuncia.usuario?.nome ||
    denuncia.usuario?.username ||
    denuncia.usuario?.name ||
    'Usuário desconhecido'
  );
}
getReportFotoUrl(denuncia: any): string {
    if (denuncia.reportFotoUrl) {
      if (denuncia.reportFotoUrl.startsWith("http")) return denuncia.reportFotoUrl
      return "http://localhost:5000" + denuncia.reportFotoUrl
    }
    return "assets/defaultProfile.png"
  }

  
}
