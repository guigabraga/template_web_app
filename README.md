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

## Executar o monorepo

O comando geral utiliza o Turborepo para iniciar todos os workspaces que
possuem um script `dev`:

```bash
npm run dev
```

O Vite disponibiliza a aplicação web em `http://localhost:5173` e a API em
`http://localhost:3333` por padrão.

Para gerar todos os builds disponíveis:

```bash
npm run build
```

## Docker Compose

Os ambientes Docker ficam em `compose/dev`, `compose/homolog` e `compose/prod`.
Somente o ambiente de desenvolvimento está configurado neste momento.

O arquivo `compose/dev/.env` centraliza as portas externas e as credenciais do
PostgreSQL. Dentro da rede Docker, a API usa a porta `1001`, o web usa `1002` e
o PostgreSQL usa `5432`.

Ao preparar um novo clone do projeto:

```bash
cp compose/dev/.env.example compose/dev/.env
```

Para subir API, web e PostgreSQL:

```bash
npm run compose:dev:up
```

Esse comando executa `npm ci --include=dev` para todos os workspaces antes de
iniciar as aplicações. API e web só são iniciados quando a instalação termina
com sucesso. Um volume Docker mantém o cache de downloads do npm entre
execuções.

Serviços disponíveis com os valores padrão:

```text
Web:        http://localhost:3002
API:        http://localhost:3001
Health:     http://localhost:3001/health
PostgreSQL: localhost:5432
```

Comandos de gerenciamento:

```bash
npm run compose:dev:config
npm run compose:dev:ps
npm run compose:dev:logs
npm run compose:dev:down
```

Para encerrar os serviços e apagar também os dados locais do PostgreSQL:

```bash
npm run compose:dev:reset
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

Use os scripts de conveniência da raiz para executar a API isoladamente:

```bash
npm run dev:api
npm run build:api
npm run start:api
npm run typecheck:api
```

Durante o desenvolvimento, `tsx` observa alterações em `src/Server.ts`. Após o
build, o comando `start` executa o JavaScript gerado em `dist/Server.js`.

Também é possível chamar diretamente o workspace:

```bash
npm run dev --workspace @template-web-app/api
npm run build --workspace @template-web-app/api
npm run start --workspace @template-web-app/api
npm run typecheck --workspace @template-web-app/api
```

Para verificar a API em execução, acesse:

```text
GET http://localhost:3333/health
```

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

## Temas

O seletor no navbar oferece os modos claro, escuro e sistema usando os temas
padrão do Material UI. A preferência é gerenciada pelo store Zustand em
`apps/web/src/store/theme.ts` e persistida no `localStorage` com a chave
`template-web-app-theme`.

O provider central em `apps/web/src/theme/index.tsx` acompanha alterações do tema
do sistema quando o modo selecionado é `system`.

### VS Code

Abra a raiz do monorepo no VS Code, e não apenas um workspace interno:

```bash
code .
```

Aceite a recomendação para instalar as extensões ESLint e Prettier. As
configurações em `.vscode/settings.json` mostram os problemas do ESLint durante
a edição e aplicam as correções disponíveis ao salvar. Não é necessário alterar
o `settings.json` global do VS Code.

Se a pasta já estava aberta antes da instalação ou alteração das extensões,
execute `Developer: Reload Window` e depois `ESLint: Restart ESLint Server` pela
paleta de comandos.
