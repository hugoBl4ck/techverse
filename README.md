# 📚 TechVerse - Sistema de Gestão para Assistências Técnicas

![TechVerse](https://img.shields.io/badge/TechVerse-v1.0-purple)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)
![PWA](https://img.shields.io/badge/PWA-Enabled-blue)

## 🚀 Sobre o Projeto

TechVerse é uma plataforma completa de gestão para assistências técnicas de informática. Desenvolvido com Vue.js 3, Firebase e implementado como Progressive Web App (PWA), oferece uma solução moderna e eficiente para gerenciar todos os aspectos de uma assistência técnica.

### ✨ Principais Funcionalidades

- 📋 **Gestão de Ordens de Serviço** - Workflow completo do diagnóstico à entrega
- 👥 **Gestão de Clientes** - Histórico completo e controle de equipamentos
- 📦 **Controle de Inventário** - Gestão de peças e componentes
- 💰 **Dashboard Financeiro** - Métricas de receitas, despesas e lucratividade
- 📰 **Sistema de Notícias** - Mantenha clientes informados
- 🎁 **Promoções Integradas** - Divulgue ofertas com links de afiliados
- 🎮 **Ranking de CPUs** - Gamificação e comparação de processadores
- 🔧 **Guia de Otimização** - Ajude clientes a melhorar performance
- 📱 **PWA** - Funciona offline e pode ser instalado

## 🏗️ Tecnologias Utilizadas

- **Frontend:** Vue.js 3 (Composition API)
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Firestore + Authentication)
- **Build:** Vite
- **PWA:** Vite PWA Plugin
- **Hosting:** Vercel

## 🌐 Demo

**URL:** [https://techverseapp.vercel.app](https://techverseapp.vercel.app)

## 📖 Documentação

Toda a documentação está organizada na pasta `/docs`:

### 📂 Estrutura de Documentação

```
docs/
├── README.md                    # Este arquivo
├── LEIA_PRIMEIRO.md            # Guia de início rápido
├── QUICK_START.md              # Instalação e configuração
│
├── 📘 guias/                   # Guias de uso e desenvolvimento
│   ├── GUIA_PWA.md
│   ├── GUIA_SITEMAP_SEO.md
│   ├── GUIA_MARKETING_SOCIAL.md
│   ├── GUIA_MODULO_FINANCEIRO.md
│   ├── GUIA_PAGINA_NOTICIAS.md
│   ├── GUIA_PAGINA_PROMOCOES.md
│   └── ... (mais guias)
│
├── 🏗️ arquitetura/            # Arquitetura e estrutura
│   ├── ARQUITETURA_FINANCEIRA.md
│   ├── ARQUITETURA_PROMO_DOACAO.md
│   ├── DIAGRAMA_FLUXO_NOVO.md
│   └── ESTRUTURA_VISUAL.md
│
├── 📢 marketing/               # Material de marketing
│   ├── APRESENTACAO_LINKEDIN.md
│   ├── APRESENTACAO_TWITTER_X.md
│   ├── APRESENTACAO_FACEBOOK.md
│   └── MARKETING_UPGRADE.md
│
├── 🔧 correcoes/              # Correções e fixes
│   ├── CORRECOES_FIREBASE_PWA.md
│   ├── FIRESTORE_RULES_FIX.md
│   ├── FIX_404_E_ROTAS.md
│   └── ... (mais correções)
│
├── ✅ checklists/             # Checklists de tarefas
│   ├── CHECKLIST_SITEMAP.md
│   ├── CHECKLIST_FINANCEIRO.md
│   └── CHECKLIST_NOTICIAS.md
│
└── 📝 exemplos/               # Exemplos de código
    ├── EXEMPLOS_INTEGRACAO.md
    └── EXEMPLO_INTEGRACAO_FINANCEIRO.md
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Firebase (para backend)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/hugoBl4ck/techverse.git

# Entre na pasta
cd techverse

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Firebase

# Inicie o servidor de desenvolvimento
npm run dev
```

### Build para Produção

```bash
# Build
npm run build

# Preview do build
npm run preview
```

## 📚 Guias Principais

### Para Começar
1. [LEIA_PRIMEIRO.md](./LEIA_PRIMEIRO.md) - Visão geral do projeto
2. [QUICK_START.md](./QUICK_START.md) - Configuração inicial

### Desenvolvimento
- [GUIA_PWA.md](./guias/GUIA_PWA.md) - Como funciona o PWA
- [GUIA_SITEMAP_SEO.md](./guias/GUIA_SITEMAP_SEO.md) - SEO e sitemap
- [CHEAT_SHEET_IMPORTS.md](./guias/CHEAT_SHEET_IMPORTS.md) - Referência de imports

### Funcionalidades
- [GUIA_MODULO_FINANCEIRO.md](./guias/GUIA_MODULO_FINANCEIRO.md) - Módulo financeiro
- [GUIA_PAGINA_NOTICIAS.md](./guias/GUIA_PAGINA_NOTICIAS.md) - Sistema de notícias
- [GUIA_PAGINA_PROMOCOES.md](./guias/GUIA_PAGINA_PROMOCOES.md) - Sistema de promoções

### Marketing
- [GUIA_MARKETING_SOCIAL.md](./marketing/GUIA_MARKETING_SOCIAL.md) - Estratégia de redes sociais
- [APRESENTACAO_LINKEDIN.md](./marketing/APRESENTACAO_LINKEDIN.md) - Posts para LinkedIn
- [APRESENTACAO_TWITTER_X.md](./marketing/APRESENTACAO_TWITTER_X.md) - Posts para Twitter/X
- [APRESENTACAO_FACEBOOK.md](./marketing/APRESENTACAO_FACEBOOK.md) - Posts para Facebook

## 🎯 Funcionalidades Principais

### 1. Gestão de Ordens de Serviço
- Criação e acompanhamento de ordens
- Workflow visual (Aguardando → Em Andamento → Concluído)
- Histórico completo de serviços
- Controle de peças utilizadas

### 2. Gestão de Clientes
- Cadastro completo de clientes
- Histórico de equipamentos
- Comunicação centralizada
- Métricas de atendimento

### 3. Controle de Inventário
- Gestão de peças e componentes
- Alertas de estoque baixo
- Histórico de movimentações
- Controle de valores

### 4. Dashboard Financeiro
- Receitas e despesas em tempo real
- Gráficos de lucratividade
- Fluxo de caixa
- Relatórios mensais

### 5. Sistema de Notícias
- Publicação de conteúdo
- Categorização de notícias
- Engajamento com clientes
- SEO otimizado

### 6. Promoções Integradas
- Divulgação de ofertas
- Links de afiliados
- Integração com marketplaces
- Tracking de conversões

### 7. PWA (Progressive Web App)
- Funciona offline
- Instalável em qualquer dispositivo
- Atualizações automáticas
- Performance otimizada

## 🔒 Segurança

- Autenticação via Firebase Auth
- Regras de segurança Firestore
- Sistema multi-tenant
- Proteção de rotas
- Validação de dados

## 📊 Performance

- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- PWA compliant
- Code splitting
- Lazy loading

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Hugo Black**
- GitHub: [@hugoBl4ck](https://github.com/hugoBl4ck)

## 🙏 Agradecimentos

- Vue.js Team
- Firebase Team
- Tailwind CSS Team
- Comunidade Open Source

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do site.

---

**Desenvolvido com ❤️ para a comunidade tech brasileira**
