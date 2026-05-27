# WhatsApp Service - NovaWave - Arena

Microservico Node.js responsavel pelo envio de mensagens via WhatsApp, usando a biblioteca [Baileys](https://github.com/WhiskeySockets/Baileys).

## Requisitos

- Node.js 18+
- NPM ou Yarn

## Instalacao

```bash
cd whatsapp-service
npm install
```

## Executando

```bash
npm start
```

O servico sobe na porta **3001** por padrao.
Para usar outra porta, defina a variavel de ambiente `WA_PORT`:

```bash
WA_PORT=4000 npm start
```

## Como conectar o WhatsApp

1. Com o servico rodando, acesse o frontend da aplicacao
2. Va ate a area de mensagens/WhatsApp
3. Um **QR Code** sera exibido; escaneie com o WhatsApp do celular
   _(WhatsApp > Aparelhos conectados > Conectar aparelho)_
4. Apos o scan, o status muda para **conectado** e mensagens podem ser enviadas

A sessao e salva na pasta `auth_info/`; enquanto ela existir, nao e necessario escanear o QR Code novamente.

Para deslogar e limpar a sessao, use o endpoint `POST /disconnect`.

## Endpoints

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/status` | Retorna o status atual da conexao |
| GET | `/events` | SSE: stream em tempo real de status e QR Code |
| POST | `/connect` | Inicia a conexao (se desconectado) |
| POST | `/disconnect` | Desloga e apaga a sessao salva |
| POST | `/send` | Envia mensagem para um numero |
| POST | `/send-bulk` | Envia mensagem em massa para varios numeros |

### POST /send

```json
{
  "phone": "11999998888",
  "message": "Ola! Sua mensalidade esta vencendo."
}
```

### POST /send-bulk

```json
{
  "contacts": ["11999998888", "11977776666"],
  "message": "Ola! Sua mensalidade esta vencendo."
}
```

> O numero pode ser informado com ou sem o codigo do pais; `55` e adicionado automaticamente.

## Integracao com a Aplicacao

- O frontend consome `/events` via SSE para exibir status de conexao e QR Code em tempo real.
- O modulo de mensagens usa templates prontos, envio individual e envio em massa.
- O backend registra o historico das mensagens enviadas para auditoria.
- A integracao apoia rotinas de cobranca, comunicados por turma e mensagens gerais da arena.

## Estrutura

```
whatsapp-service/
├── index.js       # Servidor Express + logica Baileys
├── package.json
├── README.md
└── auth_info/     # Sessao salva (gerado automaticamente, nao commitar)
```
