# Frontend · Notas fiscais

Interface em **Angular 22** para cadastrar e consultar notas fiscais. Consome a API em `/api/notas` (proxy para `http://localhost:5088` em desenvolvimento).

Na tela principal você:

- cadastra nota (`número`, `cliente`, `valor`, `data de emissão`) com validação no formulário
- vê a tabela atualizada sem recarregar a página
- filtra por cliente
- ordena por valor (crescente / decrescente)

## Pré-requisitos

- **Node.js 24** (o Angular 22 não aceita Node 25)
- npm
- a API do backend rodando em `http://localhost:5088`

Se você usa [NVS](https://github.com/jasongin/nvs):

```powershell
. "$env:LOCALAPPDATA\nvs\nvs.ps1"
nvs use 24
node --version
```

## Como executar

Na pasta `frontend`:

```powershell
npm install
npm start
```

Abra **http://localhost:4200**.

O `proxy.conf.json` encaminha `/api` para a API. O front chama `/api/notas` no mesmo origin do Angular; não é preciso apontar a URL da API no código.

Se a listagem falhar ao abrir a tela, confira se o backend está no ar.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm start` | Servidor de desenvolvimento (`ng serve`) |
| `npm run build` | Build de produção |
| `npm test` | Testes unitários (Vitest) |

## Estrutura

```
src/app/
  core/models/          contrato da API
  core/services/        cliente HTTP (`NotasApiService`)
  features/notas/       formulário, filtro, tabela
```
