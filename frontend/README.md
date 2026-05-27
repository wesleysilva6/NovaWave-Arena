# NovaWave - Arena - Frontend

Aplicacao web SPA desenvolvida em React 19 com TypeScript, Vite e Chakra UI para gestao de arenas esportivas. Consome a API RESTful do backend e integra com o servico WhatsApp.

## Arquitetura

```
src/
├── pages/                  # Paginas organizadas por modulo
│   ├── dashboard/          # Painel com metricas, graficos e vencimentos
│   ├── analises/           # Visao gerencial com filtros avancados
│   ├── alunos/             # CRUD de alunos, turmas e historico de presencas
│   ├── modalidades/        # CRUD de modalidades
│   ├── turmas/             # CRUD de turmas + matricula + professor
│   ├── mensalidades/       # Gestao de mensalidades por competencia
│   ├── gastos/             # Controle de despesas
│   ├── funcionarios/       # Gestao de funcionarios, cargos e salarios
│   ├── presencas/          # Controle de presencas e faltas
│   ├── mensagens/          # Envio de mensagens WhatsApp
│   ├── notificacoes/       # Centro de notificacoes
│   ├── configuracoes/      # Valores globais e cargos
│   ├── perfil/             # Dados basicos do usuario e senha
│   └── login/              # Autenticacao
├── components/             # Componentes globais
│   ├── Sidebar.tsx         # Menu lateral com navegacao
│   ├── Topbar.tsx          # Barra superior com notificacoes
│   └── AppLayout.tsx       # Layout principal (Sidebar + Topbar + Outlet)
├── contexts/               # Contextos React
│   ├── AuthContext.tsx     # Autenticacao JWT (login, logout, user)
│   └── NotificacoesContext.tsx  # Notificacoes em tempo real
├── service/                # Camada HTTP unica responsavel por acessar a API
│   ├── http.ts             # Instancia Axios, token JWT, interceptors
│   ├── auth.ts             # Login
│   ├── dashboard.ts        # Dados do dashboard
│   ├── analises.ts         # Dados gerenciais e filtros
│   ├── alunos.ts           # CRUD alunos + modalidades
│   ├── cargosFuncionarios.ts # CRUD de cargos de funcionarios
│   ├── configuracoes.ts    # Valores globais da arena
│   ├── funcionarios.ts     # CRUD funcionarios
│   ├── modalidades.ts      # CRUD modalidades
│   ├── turmas.ts           # CRUD turmas + matricula
│   ├── mensalidades.ts     # Mensalidades + geracao
│   ├── gastos.ts           # CRUD gastos + resumo
│   ├── presencas.ts        # Presencas por turma/aluno
│   ├── mensagens.ts        # Mensagens + grupos WhatsApp
│   ├── usuario.ts          # Perfil + alteracao de senha
│   └── whatsapp.ts         # Cliente SSE do WhatsApp Service
├── utils/
│   ├── formatters.ts       # Formatacao de CPF, telefone, moeda, data
│   ├── alertas.ts          # Alertas e confirmacoes (SweetAlert2)
│   └── types.ts            # Tipos compartilhados
├── theme/
│   └── index.ts            # Tema Chakra UI (cor brand: #1890FF)
├── AuthLayout.tsx          # Layout para rotas publicas
├── ProtectedLayout.tsx     # Layout protegido (valida JWT)
├── App.tsx                 # Definicao de rotas
└── main.tsx                # Entry point
```

### Padroes utilizados

- **Service Layer** - toda comunicacao HTTP centralizada em `service/`
- **Protected Routes** - `ProtectedLayout` valida JWT antes de renderizar
- **Component Composition** - cada pagina composta por componentes na pasta `components/`
- **Context API** - estado global de autenticacao e notificacoes
- **Formatters centralizados** - `utils/formatters.ts` com mascaras de CPF, telefone, moeda e formatos de exibicao

## Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| React 19 | Framework UI |
| TypeScript 5.9 | Tipagem estatica |
| Vite 7 | Build tool e dev server |
| Chakra UI 2 | Design system e componentes |
| React Router 7 | Roteamento SPA |
| Axios | Cliente HTTP |
| Framer Motion | Animacoes |
| ExcelJS | Exportacao para Excel |
| jsPDF | Geracao de PDFs |
| date-fns | Manipulacao de datas |
| SweetAlert2 | Alertas e confirmacoes |

## Rotas da Aplicacao

### Publicas

| Rota | Pagina | Descricao |
|------|--------|-----------|
| `/` | Login | Redirecionamento para login |
| `/login` | Login | Autenticacao com email e senha |

### Protegidas (requerem JWT valido)

| Rota | Pagina | Descricao |
|------|--------|-----------|
| `/dashboard` | Dashboard | Metricas, graficos, receita e vencimentos |
| `/analises` | Analises | KPIs, filtros avancados e graficos dinamicos |
| `/alunos` | Alunos | Cadastro e gestao de alunos |
| `/modalidades` | Modalidades | Gerenciamento de modalidades |
| `/turmas` | Turmas | Turmas, horarios, professores e matriculas |
| `/mensalidades` | Mensalidades | Cobranca por competencia e confirmacao de pagamento |
| `/gastos` | Gastos | Registro de despesas por categoria |
| `/funcionarios` | Funcionarios | Cadastro de funcionarios, cargos e salarios |
| `/presencas` | Presencas | Controle de frequencia, faltas e pendencias |
| `/mensagens` | Mensagens | Envio WhatsApp individual/em massa |
| `/notificacoes` | Notificacoes | Alertas de vencimentos e pendencias |
| `/perfil` | Meu Perfil | Dados basicos do usuario e senha |
| `/configuracoes` | Configuracoes | Valores globais da arena e cargos |

## Camada de Service

Nenhuma pagina faz requisicoes HTTP diretamente. Toda comunicacao passa pela pasta `service/`:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `http.ts` | Instancia Axios, JWT helpers (save/get/clear/validate), interceptors |
| `auth.ts` | `POST /login` |
| `dashboard.ts` | `GET /dashboard` |
| `analises.ts` | `GET /analises` com filtros de periodo, modalidade e situacao |
| `alunos.ts` | CRUD alunos, listagem de modalidades, turmas por aluno |
| `cargosFuncionarios.ts` | CRUD de cargos de funcionarios |
| `configuracoes.ts` | Valores gerais da arena |
| `funcionarios.ts` | CRUD funcionarios |
| `modalidades.ts` | CRUD modalidades, toggle status |
| `turmas.ts` | CRUD turmas, matricula/remocao de alunos |
| `mensalidades.ts` | Listagem, confirmacao, geracao mensal |
| `gastos.ts` | CRUD gastos, resumo mensal por categoria |
| `presencas.ts` | Listagem por turma/aluno, marcacao de presenca/falta |
| `mensagens.ts` | Historico, envio, grupos WhatsApp, templates |
| `usuario.ts` | Perfil, atualizacao de dados, alteracao de senha |
| `whatsapp.ts` | SSE (status/QR), connect, disconnect, send, send-bulk |

## Funcionalidades Recentes

- Dashboard redesenhada com graficos interativos e indicadores financeiros.
- Tela de analises com filtro inicial no mes atual, do primeiro ao ultimo dia.
- Grafico "Aulas por dia da semana" baseado na quantidade de turmas/aulas cadastradas por dia.
- Mensalidades por competencia, com pagamento antecipado entrando na receita do mes correto.
- Mensalidade proporcional para entrada no meio do mes e bloqueio de cobranca quando nao ha aula no periodo.
- Presencas com status pendente, presente e faltou, respeitando a data de entrada do aluno.
- Historico de presencas do aluno com faltas visiveis para reposicao.
- Gestao de funcionarios com salarios integrados aos gastos.
- Cadastro de cargos em configuracoes e vinculacao de professores nas turmas.
- Separacao entre Meu Perfil e Configuracoes.

## Formatadores (`utils/formatters.ts`)

| Funcao | Descricao | Exemplo |
|--------|-----------|---------|
| `formatCurrency(value)` | Exibicao de moeda | `R$ 1.234,56` |
| `maskCurrency(value)` | Mascara de input monetario | `1.234,56` |
| `unmaskCurrency(value)` | Converte mascara para `number` | `1234.56` |
| `formatCPF(cpf)` | Exibicao de CPF | `123.456.789-00` |
| `maskCPF(value)` | Mascara de input CPF | `123.456.789-00` |
| `unmaskCPF(value)` | Remove mascara | `12345678900` |
| `formatPhone(phone)` | Exibicao de telefone | `(11) 99999-0000` |
| `maskPhone(value)` | Mascara de input telefone | `(11) 99999-0000` |
| `unmaskPhone(value)` | Remove mascara | `11999990000` |
| `formatDate(dateStr)` | Exibicao de data | `12/04/2026` |

## Fluxo de Autenticacao

1. Usuario envia email + senha em `/login`
2. `auth.ts` faz `POST /login`; backend retorna JWT
3. Token salvo no localStorage via `http.ts`
4. `ProtectedLayout` valida o token a cada navegacao
5. Token expirado redireciona automaticamente para `/login`
6. Axios interceptor injeta `Authorization: Bearer <token>` em todas as requisicoes

## Como Executar

### Desenvolvimento local

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

### Producao com Docker

```bash
cd frontend
docker compose up -d    # http://localhost:3000
```

### Scripts disponiveis

| Script | Descricao |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de producao |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificacao ESLint |
| `npm run lint:fix` | Correcao automatica ESLint |
| `npm run format` | Formatacao Prettier |

## Variaveis de Ambiente

| Variavel | Descricao | Padrao |
|----------|-----------|--------|
| `VITE_API_BASE_URL` | URL da API backend | `http://localhost:8085` |
| `VITE_WA_BASE_URL` | URL do WhatsApp Service | `http://localhost:3001` |
