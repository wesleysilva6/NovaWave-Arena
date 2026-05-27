<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=1890FF&height=120&section=header&text=Arenas%20Gestao&fontSize=60&animation=fadeIn&fontColor=ffffff" />

[![Typing SVG](https://readme-typing-svg.herokuapp.com?color=1890FF&size=35&center=true&vCenter=true&width=1000&lines=Sistema+de+Gestao+para+Arenas;Controle+de+Alunos+e+Turmas;Mensalidades+e+Financeiro;WhatsApp+Integrado)](https://git.io/typing-svg)

---

<p align="center">
  <a href="#-sobre-o-projeto"><img alt="Sobre" src="https://img.shields.io/badge/-Sobre%20o%20Projeto-1890FF?style=for-the-badge&logo=about-dot-me&logoColor=white" /></a>
  <a href="#-tecnologias-utilizadas"><img alt="Tech" src="https://img.shields.io/badge/-Tecnologias-1890FF?style=for-the-badge&logo=dev.to&logoColor=white" /></a>
  <a href="#-funcionalidades"><img alt="Features" src="https://img.shields.io/badge/-Funcionalidades-1890FF?style=for-the-badge&logo=awesome&logoColor=white" /></a>
  <a href="#-arquitetura"><img alt="Arch" src="https://img.shields.io/badge/-Arquitetura-1890FF?style=for-the-badge&logo=diagrams.net&logoColor=white" /></a>
  <a href="#-como-executar"><img alt="Run" src="https://img.shields.io/badge/-Como%20Executar-1890FF?style=for-the-badge&logo=github-actions&logoColor=white" /></a>
  <a href="#-banco-de-dados"><img alt="DB" src="https://img.shields.io/badge/-Banco%20de%20Dados-1890FF?style=for-the-badge&logo=postgresql&logoColor=white" /></a>
  <a href="#-contato"><img alt="Contact" src="https://img.shields.io/badge/-Contato-1890FF?style=for-the-badge&logo=telegram&logoColor=white" /></a>
</p>

---

## Sobre o Projeto

Arenas Gestao e um sistema web completo para gerenciamento de arenas e centros esportivos.

Desenvolvido com foco em praticidade e experiencia do usuario, ele centraliza tudo que a arena precisa:

- Cadastro e controle completo de alunos
- Turmas, modalidades e controle de matriculas
- Mensalidades e gestao financeira de gastos
- Registro de presencas por turma e data
- Dashboard profissional com graficos gerenciais
- Tela de analises com filtros avancados
- Gestao de funcionarios, cargos e custos recorrentes
- Envio de mensagens via WhatsApp com templates prontos
- Notificacoes automaticas de vencimentos
- Perfil separado de configuracoes gerais da arena

---

## Tecnologias Utilizadas

### Front-end
<p align="center">
  <code><img height="32" src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" alt="React 19"/></code>
  <code><img height="32" src="https://raw.githubusercontent.com/github/explore/main/topics/typescript/typescript.png" alt="TypeScript 5.9"/></code>
  <code><img height="32" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" alt="Vite 7"/></code>
  <code><img height="32" src="https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png" alt="JavaScript"/></code>
  <code><img height="32" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain.svg" alt="Axios"/></code>
</p>

### Back-end
<p align="center">
  <code><img height="32" src="https://raw.githubusercontent.com/github/explore/main/topics/php/php.png" alt="PHP 8.2"/></code>
  <code><img height="32" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/postgresql/postgresql.png" alt="PostgreSQL 15"/></code>
  <code><img height="32" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker"/></code>
</p>

### Ferramentas
<p align="center">
  <code><img height="32" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js"/></code>
  <code><img height="32" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git"/></code>
  <code><img height="32" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code"/></code>
  <code><img height="32" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/composer/composer-original.svg" alt="Composer"/></code>
</p>

---

## Bibliotecas Utilizadas

- **Chakra UI 2** -- sistema de design e componentes UI
- **Firebase PHP-JWT** -- autenticacao via tokens JWT
- **Baileys 6.7** -- integracao com WhatsApp Web via Node.js
- **ExcelJS / jsPDF** -- exportacao de relatorios
- **Framer Motion** -- animacoes fluidas na interface
- **Slim Framework 4** -- micro-framework PHP para a API REST

---

## Funcionalidades

- **Dashboard** -- metricas em tempo real (alunos, receita, turmas, presencas)
- **Alunos** -- cadastro completo com CPF, telefone, contrato e matricula em turmas
- **Modalidades** -- CRUD de modalidades esportivas com ativacao/desativacao
- **Turmas** -- vinculadas a modalidades, com dias, horarios, professor e vagas
- **Mensalidades** -- geracao automatica por competencia, proporcional por aulas e confirmacao de pagamento
- **Gastos** -- registro de despesas por categoria com resumo mensal
- **Funcionarios** -- cadastro de colaboradores, cargos e salarios refletidos em gastos
- **Presencas** -- marcacao por turma e data, status presente/faltou/pendente e historico por aluno
- **Analises** -- visao gerencial com KPIs, graficos dinamicos e filtros por periodo/modalidade
- **Mensagens** -- envio via WhatsApp com templates, QR Code e historico
- **Notificacoes** -- alertas automaticos de vencimentos proximos e atrasados
- **Perfil** -- dados basicos do usuario e alteracao de senha
- **Configuracoes** -- valores globais da arena e cadastro de cargos

---

## Arquitetura

```
Frontend (React)  HTTP:8085>  Backend (PHP Slim)  SQL>  PostgreSQL
      |
      HTTP+SSE:3001>  WhatsApp Service (Node.js)
```

| Servico | Tecnologia | Porta |
|---------|-----------|-------|
| Frontend | React 19 + TypeScript + Vite | 3000 |
| Backend | PHP 8.2 + Slim 4 | 8085 |
| Banco de Dados | PostgreSQL 15 | 5432 |
| WhatsApp | Node.js + Baileys | 3001 |

---

## Como Executar

```bash
# 1. Clone o repositorio
git clone https://github.com/wesleysilva6/arenas-gestao.git
cd arenas-gestao

# 2. Backend + Banco de Dados
cd backend
cp .env.example .env
docker compose up -d
# Na 1a execucao, importe o schema:
# psql -U postgres -d arenas_gestao -f banco.sql

# 3. Frontend
cd ../frontend
npm install
npm run dev              # Dev em http://localhost:5173

# 4. WhatsApp Service
cd ../whatsapp-service
npm install
node index.js            # http://localhost:3001
```

---

## Banco de Dados

| Tabela | Descricao |
|--------|-----------|
| usuario | Usuarios do sistema (admin) |
| modalidade | Modalidades esportivas |
| turma | Turmas vinculadas a modalidades |
| aluno | Cadastro de alunos |
| aluno_turma | Matricula de alunos em turmas |
| mensalidade | Mensalidades (pendente, pago, atrasada) |
| presenca | Registro de presenca por aluno/turma/data |
| gasto | Despesas da arena por categoria |
| funcionario | Funcionarios, cargos, salarios e dados de contato |
| cargo_funcionario | Cargos usados no cadastro de funcionarios |
| mensagem | Historico de mensagens enviadas |
| grupo_whatsapp | Grupos WhatsApp cadastrados |
| notificacao | Notificacoes do sistema |
| configuracao | Configuracoes gerais da arena |

---

## Roadmap

- [x] 📊 Dashboard profissional com KPIs, agenda semanal e graficos financeiros
- [x] 👥 CRUD completo de Alunos, Turmas e Modalidades
- [x] 💳 Controle de Mensalidades com geracao automatica por competencia
- [x] 🧮 Mensalidade proporcional por aulas realizadas/programadas
- [x] 🔁 Aluno em multiplas turmas com mensalidade conjunta
- [x] ✅ Registro de Presencas com presente, faltou e pendente
- [x] 🩹 Controle de faltas para historico e reposicao
- [x] 💸 Gestao de Gastos por categoria
- [x] 🧑‍💼 Gestao de Funcionarios, cargos e salarios integrados aos gastos
- [x] 📈 Tela de Analises com filtros avancados e graficos dinamicos
- [x] ⚙️ Configuracoes gerais de valores e cargos
- [x] 👤 Perfil separado de Configuracoes
- [x] 💬 Integracao WhatsApp com templates e QR Code
- [x] 🔔 Sistema de Notificacoes automaticas
- [ ] 📱 App mobile (React Native)
- [ ] 📄 Relatorios financeiros em PDF/Excel
- [ ] ⏰ Agendamento de mensagens automaticas
- [ ] 🏆 Modulo de competicoes e eventos

---

<h2 align="center">Contato</h2>
<p align="center">Entre em contato pelos canais abaixo:</p>
<p align="center">
  <a href="https://www.linkedin.com/in/wesley-wagner-nunes-silva/" target="_blank">
    <img src="https://user-images.githubusercontent.com/74038190/235294012-0a55e343-37ad-4b0f-924f-c8431d9d2483.gif" width="50px" />
  </a>
</p>

---

<p align="center"><img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=1890FF&height=120&section=footer"/></p>
