# Template Web App

Template de monorepo para uma aplicação web completa, gerenciado com npm
workspaces e Turborepo.

## Estrutura

```text
apps/
  api/          Configuração reservada para a futura API
  web/          Aplicação React com Vite
packages/
  db/           Schema, configuração e cliente Prisma
```

As configurações compartilhadas de Turbo, ESLint, Prettier e VS Code ficam na
raiz do repositório.

## Requisitos

- Node.js 22.12 ou superior
- npm 10.8.2 ou superior
- PostgreSQL, caso os comandos do pacote `db` sejam utilizados

Com NVM, use a versão declarada em `.nvmrc`:

```bash
nvm install
nvm use
```

## Instalação

Na raiz do repositório, instale todas as dependências dos workspaces:

```bash
npm install
```

Para utilizar o Prisma, crie o arquivo de ambiente do pacote de banco:

```bash
cp packages/db/.env.example packages/db/.env
```

Altere `DATABASE_URL` em `packages/db/.env` conforme a conexão do PostgreSQL.

## Executar o monorepo

O comando geral utiliza o Turborepo para iniciar todos os workspaces que
possuem um script `dev`:

```bash
npm run dev
```

Atualmente, apenas a aplicação web possui esse script. O Vite disponibiliza a
aplicação em `http://localhost:5173` por padrão.

Para gerar todos os builds disponíveis:

```bash
npm run build
```

## Executar isoladamente

### Web

Use os scripts de conveniência da raiz:

```bash
npm run dev:web
npm run build:web
npm run preview:web
```

Também é possível chamar diretamente o workspace:

```bash
npm run dev --workspace @template-web-app/web
npm run build --workspace @template-web-app/web
npm run preview --workspace @template-web-app/web
```

### Banco de dados

O pacote `db` não inicia um servidor. Ele disponibiliza comandos do Prisma:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

Os mesmos comandos podem ser executados diretamente no workspace:

```bash
npm run generate --workspace @template-web-app/db
npm run db:migrate --workspace @template-web-app/db
npm run db:studio --workspace @template-web-app/db
```

### API

O workspace `@template-web-app/api` está reservado, mas ainda não possui
implementação ou script de execução.

## Qualidade de código

Execute as verificações a partir da raiz:

```bash
npm run lint
npm run typecheck
npm run format:check
```

Para aplicar correções:

```bash
npm run lint:fix
npm run format
```
