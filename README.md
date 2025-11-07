# TechVerse

## Descrição

O TechVerse é um sistema de gestão abrangente desenvolvido para otimizar o gerenciamento de clientes, serviços, inventário de peças e montagem de kits. Construído com Vue 3, Vite e TailwindCSS, oferece uma interface moderna e responsiva para facilitar as operações diárias.

## Funcionalidades

- **Dashboard:** Visão geral e acesso rápido às principais funcionalidades.
- **Gestão de Clientes:** Cadastro, listagem, visualização de detalhes e edição de informações de clientes.
- **Gestão de Serviços:** Registro e acompanhamento de serviços prestados, associados a clientes.
- **Gestão de Inventário:** Controle de peças em estoque, incluindo cadastro, edição e listagem. Funcionalidade de importação de peças via IA.
- **Montador de Kits:** Ferramenta para criar e gerenciar kits de peças, com visualização de detalhes dos kits salvos.

## Tecnologias Utilizadas

- [Vue 3](https://vuejs.org/) - Framework progressivo para construção de interfaces de usuário.
- [Vite](https://vitejs.dev/) - Ferramenta de build rápida para desenvolvimento web moderno.
- [Vue Router](https://router.vuejs.org/) - Roteamento oficial para Vue.js.
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário para estilização rápida e responsiva.
- [Firebase](https://firebase.google.com/) - Plataforma de desenvolvimento de aplicativos (provavelmente para autenticação e/ou banco de dados).
- [Radix Vue](https://www.radix-vue.com/) - Componentes UI sem estilo para Vue.
- [Lucide Vue Next](https://lucide.dev/) - Biblioteca de ícones.
- Outras dependências como `class-variance-authority`, `clsx`, `tailwind-merge`, `v-calendar`, `vuedraggable`.

## Instalação

Para configurar o projeto localmente, siga os passos abaixo:

1.  Clone o repositório:
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd techverse
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure o Firebase:
    Crie um arquivo `src/firebase/config.js` e adicione suas credenciais do Firebase:
    ```javascript
    // src/firebase/config.js
    import { initializeApp } from 'firebase/app';
    // import { getAnalytics } from 'firebase/analytics';
    // import { getAuth } from 'firebase/auth';
    // import { getFirestore } from 'firebase/firestore';

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID"
    };

    const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);
    // const auth = getAuth(app);
    // const db = getFirestore(app);

    export { app /*, analytics, auth, db */ };
    ```

## Uso

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Abra seu navegador e acesse `http://localhost:5173` (ou a porta indicada no terminal).

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento com Vite.
- `npm run build`: Compila o projeto para produção.
- `npm run preview`: Serve a build de produção localmente para pré-visualização.

## Versão Melhorada

Recentemente, o código passou por um processo de refatoração significativo para melhorar a qualidade, manutenibilidade e performance. As principais mudanças incluem:

- **Extração de Lógica para Composables:** A lógica de manipulação de dados do Firestore foi extraída de componentes para *composables* reutilizáveis. Por exemplo, `useItem.js` agora gerencia todas as operações relacionadas a itens (buscar, salvar, atualizar), limpando o componente `ItemForm.vue` de responsabilidades de back-end.

- **Componentização e Redução de Duplicação:**
  - **`KitBuilderView.vue`:** A exibição das listas de itens foi refatorada. Um componente `ItemList.vue` foi criado para renderizar cada categoria de item, e a lógica de agrupamento de itens foi centralizada em uma única propriedade computada (`groupedItems`), eliminando a repetição de código no template.
  - **`KitMount.vue`:** A função `saveKitToInventory` foi otimizada para usar um loop, tornando o código mais limpo e fácil de manter.

- **Centralização de Configurações:**
  - **`ItemChip.vue`:** A configuração de aparência dos chips de itens (ícones e cores) foi movida para um arquivo de utilitário (`src/lib/item-config.js`). Isso desacopla a configuração do componente e facilita a manutenção e reutilização.

- **Melhora na Estrutura de Dados:**
  - **`ItemForm.vue`:** Os campos do formulário foram agrupados em um único objeto reativo (`form`), simplificando o gerenciamento do estado e a passagem de dados.

Essas mudanças resultam em um código mais modular, legível e escalável, seguindo as melhores práticas do Vue 3.