import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  currentYear = new Date().getFullYear()

  sintomas = [
    {
      title: "Infraestrutura Deficiente",
      description: "Buracos nas ruas, iluminação pública quebrada, calçadas danificadas",
    },
    {
      title: "Serviços Públicos Inadequados",
      description: "Coleta de lixo irregular, falta de saneamento, transporte deficiente",
    },
    {
      title: "Questões Ambientais",
      description: "Poluição, descarte irregular de resíduos, áreas verdes abandonadas",
    },
  ]

  problemas = [
    {
      title: "Falta de Voz Cidadã",
      description: "Dificuldade para reportar problemas às autoridades competentes",
    },
    {
      title: "Processos Burocráticos",
      description: "Sistemas complexos e demorados para registrar denúncias",
    },
    {
      title: "Falta de Acompanhamento",
      description: "Ausência de feedback sobre o status das denúncias realizadas",
    },
  ]

  solucoes = [
    {
      icon: "📝",
      title: "Registro Simples",
      description: "Interface intuitiva para registrar denúncias rapidamente, com fotos e localização automática.",
    },
    {
      icon: "✅",
      title: "Acompanhamento",
      description: "Receba atualizações em tempo real sobre o status da sua denúncia e ações tomadas.",
    },
    {
      icon: "👥",
      title: "Transparência",
      description: "Conectamos cidadãos e autoridades de forma transparente e responsável.",
    },
  ]

  estatisticas = [
    { numero: "1,200+", descricao: "Denúncias Registradas" },
    { numero: "85%", descricao: "Taxa de Resolução" },
    { numero: "30", descricao: "Cidades Atendidas" },
  ]
}
