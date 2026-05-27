# NovaWave - Arena - Backend API

API RESTful desenvolvida em PHP 8.2 com Slim Framework 4, PostgreSQL 15 e Docker.

## Arquitetura

O projeto segue uma **arquitetura em camadas** com separacao clara de responsabilidades:

```
src/
├── Controllers/           # Recebimento de requisicoes HTTP e respostas
├── Domains/
│   ├── Repositories/      # Acesso ao banco de dados (static methods)
│   ├── Services/          # Logica de negocio e validacoes
│   └── SQL/               # Queries SQL organizadas por modulo
│       ├── aluno/
│       ├── analise/
│       ├── cargo_funcionario/
│       ├── configuracao/
│       ├── dashboard/
│       ├── funcionario/
│       ├── gasto/
│       ├── login/
│       ├── mensagem/
│       ├── mensalidade/
│       ├── modalidade/
│       ├── presenca/
│       ├── turma/
│       └── usuario/
├── Infrastructures/
│   ├── Config/            # Database, conexao PDO
│   └── Middleware/         # JwtAuthMiddleware
└── routes.php             # Definicao de todas as rotas
```

### Padroes utilizados

- **Service Layer** - logica de negocio centralizada nos Services
- **Repository Pattern** - queries SQL em arquivos `.sql` separados, executados via `Database::switchParams()`
- **JWT Auth** - autenticacao via `firebase/php-jwt` com middleware
- **PSR-4 Autoload** - carregamento automatico de classes via Composer

## Tecnologias

| Tecnologia | Versao | Uso |
|-----------|--------|-----|
| PHP | 8.2 | Linguagem principal |
| Slim Framework | 4 | Micro framework HTTP |
| PostgreSQL | 15 | Banco de dados |
| Firebase PHP-JWT | - | Autenticacao JWT |
| Docker | - | Containerizacao |
| Composer | - | Gerenciamento de dependencias |

## Endpoints da API

### Publicos

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/login` | Autenticacao (retorna JWT) |

### Protegidos (requerem `Authorization: Bearer <token>`)

#### Dashboard

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/dashboard` | Dados resumidos do painel, graficos e agenda |

#### Analises

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/analises` | KPIs, graficos e filtros gerenciais por periodo/modalidade |

#### Alunos

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/alunos` | Listar alunos |
| GET | `/alunos/{id}` | Buscar aluno por ID |
| POST | `/alunos` | Cadastrar aluno |
| PUT | `/alunos/{id}` | Editar aluno |
| DELETE | `/alunos/{id}` | Excluir aluno |
| PATCH | `/alunos/{id}/cancelar` | Cancelar aluno |
| GET | `/alunos/{id}/turmas` | Turmas do aluno |
| GET | `/alunos/modalidades` | Modalidades para formulario |

#### Modalidades

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/modalidades` | Listar modalidades |
| POST | `/modalidades` | Cadastrar modalidade |
| PUT | `/modalidades/{id}` | Editar modalidade |
| PATCH | `/modalidades/{id}/status` | Ativar/desativar |

#### Turmas

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/turmas` | Listar turmas |
| POST | `/turmas` | Cadastrar turma com modalidade, professor, horario e valor |
| PUT | `/turmas/{id}` | Editar turma |
| PATCH | `/turmas/{id}/status` | Ativar/desativar |
| GET | `/turmas/{id}/alunos` | Alunos da turma |
| GET | `/turmas/{id}/alunos-disponiveis` | Alunos disponiveis |
| POST | `/turmas/{id}/alunos` | Matricular aluno |
| DELETE | `/turmas/{id}/alunos/{aluno_id}` | Remover aluno |

#### Mensalidades

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/mensalidades` | Listar mensalidades |
| PATCH | `/mensalidades/{id}/confirmar` | Confirmar pagamento |
| POST | `/mensalidades/gerar` | Gerar mensalidades do mes por competencia |
| GET | `/mensalidades/sem-mensalidade` | Alunos sem mensalidade, respeitando entrada e aulas no periodo |

#### Gastos

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/gastos` | Listar gastos |
| POST | `/gastos` | Cadastrar gasto |
| PUT | `/gastos/{id}` | Editar gasto |
| DELETE | `/gastos/{id}` | Excluir gasto |
| GET | `/gastos/resumo` | Resumo mensal por categoria |

#### Funcionarios

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/funcionarios` | Listar funcionarios |
| POST | `/funcionarios` | Cadastrar funcionario |
| PUT | `/funcionarios/{id}` | Editar funcionario |
| DELETE | `/funcionarios/{id}` | Excluir funcionario |

#### Cargos de Funcionarios

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/cargos-funcionarios` | Listar cargos |
| POST | `/cargos-funcionarios` | Cadastrar cargo |
| PUT | `/cargos-funcionarios/{id}` | Editar cargo |

#### Presencas

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/presencas/turmas` | Turmas para controle, com pendencias antigas e proximas aulas |
| GET | `/presencas/aluno/{id}` | Historico de presencas do aluno |
| PATCH | `/presencas/{id}/marcar` | Marcar como pendente, presente ou faltou |

#### Mensagens

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/mensagens/historico` | Historico de mensagens |
| DELETE | `/mensagens/historico` | Limpar historico |
| GET | `/mensagens/alunos-turma-map` | Mapeamento aluno-turma |
| POST | `/mensagens` | Registrar mensagem |

#### Grupos WhatsApp

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/grupos-whatsapp` | Listar grupos |
| POST | `/grupos-whatsapp` | Cadastrar grupo |
| PUT | `/grupos-whatsapp/{id}` | Editar grupo |
| DELETE | `/grupos-whatsapp/{id}` | Excluir grupo |

#### Usuario

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/usuario/perfil` | Buscar perfil |
| PUT | `/usuario/dados` | Atualizar nome/email |
| POST | `/usuario/verificar-senha` | Verificar senha atual |
| PUT | `/usuario/senha` | Alterar senha |

#### Configuracoes

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/configuracoes` | Buscar valores globais da arena |
| PUT | `/configuracoes` | Atualizar mensalidade, aula avulsa e parametros gerais |

## Regras de Negocio

- Mensalidades usam competencia (`mes_referencia`) para receita, inclusive pagamentos antecipados.
- Alunos cadastrados depois das aulas do mes nao entram como pendencia de mensalidade nem presenca retroativa.
- Primeira competencia pode ser proporcional por quantidade de aulas realizadas ou programadas.
- Mensalidades zeradas sem aula no periodo nao sao geradas como cobranca.
- Presencas possuem os status pendente, presente e faltou.
- Funcionarios ativos sincronizam salarios como gastos do mes.
- Turmas podem ser vinculadas a professores cadastrados.
- Analises iniciam no mes atual, do primeiro ao ultimo dia, e permitem filtros avancados.

## Como Executar

### Pre-requisitos

- Docker e Docker Compose

### Configuracao

```bash
cd backend
cp .env.example .env     # Configure as variaveis
docker compose up -d     # Inicia PHP + PostgreSQL
```

Na primeira execucao, importe o schema:

```bash
docker exec -i backend-postgres psql -U postgres -d arenas_gestao < banco.sql
```

A API estara disponivel em `http://localhost:8085`.

### Variaveis de Ambiente

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| `DB_HOST` | Host do PostgreSQL | `postgres` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_NAME` | Nome do banco | `arenas_gestao` |
| `DB_USER` | Usuario do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `postgres` |
| `DB_DRIVER` | Driver PDO | `pgsql` |
| `APP_NAME` | Nome da aplicacao | `ArenaFitway` |
| `APP_ENV` | Ambiente | `development` |
| `CORS_ALLOWED_ORIGINS` | Origens CORS | `*` |

### Desenvolvimento

O container monta o diretorio `src/` como volume; alteracoes no codigo sao refletidas imediatamente sem rebuild.

Para rebuild apos mudancas no Dockerfile:

```bash
docker compose up -d --build
```

## Padrao de Resposta

Todas as respostas seguem o formato:

```json
{
  "success": true,
  "data": [ ... ]
}
```

Em caso de erro:

```json
{
  "error": "Mensagem de erro"
}
```
