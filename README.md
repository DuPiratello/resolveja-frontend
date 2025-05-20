# Frontend - ResolveJá

Este diretório contém o frontend Angular do ResolveJá, responsável pela interface de denúncias, autenticação, painel do usuário e integração com o backend Flask.

---

## 📦 Estrutura de Pastas

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── denuncias-cards/
│   │   │   │   ├── denuncias-cards.component.ts
│   │   │   │   ├── denuncias-cards.component.html
│   │   │   │   └── denuncias-cards.component.css
│   │   │   ├── nova-denuncia/
│   │   │   │   ├── nova-denuncia.component.ts
│   │   │   │   ├── nova-denuncia.component.html
│   │   │   │   └── nova-denuncia.component.css
│   │   │   └── ...
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── models/
│   │   │   ├── denuncia.model.ts
│   │   │   └── usuario.model.ts
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   └── dashboard.component.html
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── profile/
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── denuncia.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── usuario.service.ts
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   └── app.module.ts
│   ├── assets/
│   │   └── imagens/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 🛣️ Rotas e Navegação

As rotas são definidas em `app.routes.ts` e incluem:

- `/` — Página inicial (`HomeComponent`)
- `/login` — Login de usuário (`LoginComponent`)
- `/dashboard` — Painel principal com listagem de denúncias (`DashboardComponent`)
- `/nova-denuncia` — Formulário para registrar nova denúncia (`NovaDenunciaComponent`)
- `/minhas-denuncias` — Lista de denúncias do usuário autenticado (`MinhasDenunciasComponent`)
- `/profile` — Perfil do usuário (`ProfileComponent`)

Rotas como `/dashboard`, `/nova-denuncia` e `/minhas-denuncias` são protegidas pelo `AuthGuard` (`guards/auth.guard.ts`), que verifica o token JWT no `localStorage`.

---

## 🔑 Autenticação

- **Serviço:** `auth.service.ts`
- **Fluxo:**  
  - Login envia usuário/senha para o backend (`/auth/login`), recebe JWT e armazena no `localStorage`.
  - O token é incluído automaticamente no header `Authorization` de todas as requisições autenticadas.
  - Logout remove o token e redireciona para `/login`.
- **Guarda de Rotas:**  
  - `AuthGuard` impede acesso a rotas protegidas sem autenticação.

---

## 📋 Componentes Específicos

- **`denuncias-cards`**  
  Exibe cards de denúncias com título, descrição, status, data, imagem (se houver) e localização.  
  Usa *ngFor para renderizar a lista e aplica classes CSS para status diferentes.

- **`nova-denuncia`**  
  Formulário reativo com validação de campos obrigatórios, upload de imagem (preview antes do envio), seleção de localização (campo latitude/longitude) e envio para o backend via `DenunciaService`.

- **`dashboard`**  
  Mostra todas as denúncias públicas, permite filtrar por status, tipo ou data.  
  Chama `DenunciaService.getDenuncias()` na inicialização.

- **`minhas-denuncias`**  
  Lista apenas as denúncias do usuário autenticado, com opção de editar ou remover se permitido.

- **`profile`**  
  Exibe dados do usuário, permite atualização de informações básicas.

---

## 🔗 Integração com Backend

- **Base URL:** Definida em `environment.ts` (ex: `http://localhost:5000/api`)
- **Serviços:**  
  - `DenunciaService` faz chamadas para `/denuncias`, `/minhas-denuncias`, `/denuncias/:id`
  - `AuthService` para `/auth/login`, `/auth/register`
  - `UsuarioService` para `/usuarios/:id`
- **Tratamento de Erros:**  
  - Erros de autenticação redirecionam para `/login`
  - Mensagens de erro exibidas via alertas ou componentes de feedback

---

## 🧩 Modelos Tipados

- **`Denuncia`** (`models/denuncia.model.ts`)
  ```typescript
  export interface Denuncia {
    id: number;
    titulo: string;
    descricao: string;
    status: 'aberta' | 'em_andamento' | 'resolvida';
    dataCriacao: Date;
    imagemUrl?: string;
    latitude: number;
    longitude: number;
    usuarioId: number;
  }
  ```
- **`Usuario`** (`models/usuario.model.ts`)
  ```typescript
  export interface Usuario {
    id: number;
    nome: string;
    email: string;
    role: 'admin' | 'usuario';
  }
  ```

---

## 🖼️ Upload e Preview de Imagem

- O componente `nova-denuncia` permite selecionar uma imagem.
- O preview é exibido antes do envio usando FileReader.
- Pela baixa demanda não há necessidade de uma estrutura complexa por conta disso as imagens será salva no diretório src/assets

---

## 🗺️ Localização

- O formulário de denúncia captura a localização por campos para latitude e longitude.
- Atualmente utiliza APIs de mapas do Leaflet mas futuramente pode ser migrado para o Google Maps

---

## 🛠️ Boas Práticas e Convenções

- **Responsividade:**  
  CSS customizado para mobile e desktop, sem uso de frameworks externos.
- **Reutilização:**  
  Componentes e serviços são reutilizados em várias páginas.
- **Separação de responsabilidades:**  
  Serviços cuidam da lógica de dados, componentes apenas da interface.
- **Validação:**  
  Formulários reativos com validação de campos obrigatórios e feedback visual.
- **Feedback ao usuário:**  
  Mensagens de sucesso/erro após ações importantes.

---

## ❌ O que NÃO está implementado

- Não há gerenciamento global de estado (NgRx, Akita, etc.).
- Não há internacionalização (i18n).
- Não há testes unitários ou e2e além do padrão Angular.
- Não há integração com bibliotecas de UI externas (Material, Bootstrap).
- Não há SSR (Server Side Rendering).

---

## 🛠️ Como rodar o frontend

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure a URL do backend em `src/environments/environment.ts` se necessário.
3. Rode o servidor de desenvolvimento:
   ```bash
   ng serve
   ```
4. Acesse em [http://localhost:4200](http://localhost:4200)

---

## 🧪 Testes

- **Unitários:**  
  ```bash
  ng test
  ```

---

## 📚 Referências

- [Angular Documentation](https://angular.dev/docs)
- [Angular CLI](https://angular.dev/tools/cli)
- [Guia de Boas Práticas Angular](https://angular.io/guide/styleguide)

---

**Dúvidas ou sugestões? Abra uma issue ou entre em contato com o time!**