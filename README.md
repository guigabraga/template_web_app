# Template Web App

Monorepo para uma aplicação web completa, gerenciado com npm workspaces e
Turborepo.

## Estrutura

```text
apps/
  api/                  API Express
  web/                  Aplicação React com Vite
packages/
  db/                   Schema, migrations e cliente Prisma
  shared-types/         Contratos TypeScript e schemas Zod compartilhados
compose/
  dev/                  Ambiente Docker de desenvolvimento
  homolog/              Estrutura reservada para homologação
  prod/                 Estrutura reservada para produção
```

As configurações compartilhadas de Turbo, ESLint, Prettier e VS Code ficam na
raiz do repositório.

## Requisitos

- Node.js 22.12 ou superior
- npm 10.8.2 ou superior
- Docker com Docker Compose para o ambiente completo

Com NVM, use a versão declarada em `.nvmrc`:

```bash
nvm install
nvm use
```

## Instalação

Na raiz do repositório:

```bash
npm install
```

## Desenvolvimento com Turbo

Toda a aplicação é iniciada por um único comando:

```bash
npm run dev
```

O comando carrega `compose/dev/.env` e inicia o Turbo em modo de
desenvolvimento. O Turbo executa e acompanha:

```text
apps/api                 tsx watch
apps/web                 Vite HMR
packages/db              Prisma generate e TypeScript em watch
packages/shared-types    TypeScript em watch
```

Antes de iniciar API e web, o Turbo compila os packages dos quais cada
aplicação depende. Mudanças em `shared-types` recompilam o pacote e são
refletidas no web e na API. Mudanças no cliente do banco recompilam `db` e
reiniciam a API.

Ao executar diretamente no host, o PostgreSQL precisa estar disponível com as
credenciais de `compose/dev/.env`. As portas utilizadas são:

```text
Web:        http://localhost:3002
API:        http://localhost:3001
Health:     http://localhost:3001/health
PostgreSQL: localhost:5432
```

Não existem comandos para iniciar API ou web isoladamente. Builds e
verificações também devem ser executados pela raiz para que o Turbo respeite o
grafo de dependências:

```bash
npm run build
npm run typecheck
```

## Docker Compose

Somente o ambiente `dev` está configurado neste momento. Para preparar um novo
clone:

```bash
cp compose/dev/.env.example compose/dev/.env
```

Suba o ambiente completo:

```bash
npm run compose:dev:up
```

O Compose executa as seguintes etapas:

1. Instala todos os workspaces com `npm ci --include=dev`.
2. Aguarda o PostgreSQL ficar saudável.
3. Aplica migrations e executa a seed idempotente.
4. Inicia o serviço `application` com `npm run dev`.
5. O Turbo inicia API, web e os watchers dos packages.

Dentro do container, API e web usam respectivamente as portas `1001` e `1002`.
O Compose publica essas portas usando `API_EXTERNAL_PORT` e
`WEB_EXTERNAL_PORT` de `compose/dev/.env`.

O código-fonte é montado em `/workspace`. Polling está habilitado no ambiente
Docker para que alterações feitas no host sejam detectadas pelo Vite, pelo
TypeScript, pelo Prisma e pelo `tsx`.

Depois de alterar dependências, execute novamente:

```bash
npm run compose:dev:up
```

Em redes corporativas com inspeção TLS, exporte a CA confiável para
`compose/dev/.certs/` e configure `NODE_EXTRA_CA_CERTS` no `.env` com o caminho
do arquivo dentro de `/workspace`. A pasta de certificados locais não é
versionada.

Comandos de gerenciamento:

```bash
npm run compose:dev:config
npm run compose:dev:ps
npm run compose:dev:logs
npm run compose:dev:down
```

Para apagar também o volume do PostgreSQL:

```bash
npm run compose:dev:reset
```

## Banco de dados

O workspace `packages/db` centraliza o Prisma Client, schema, migrations e
seed. A API importa o singleton por `@template-web-app/db`.

Com o PostgreSQL disponível:

```bash
npm run db:generate
npm run db:migrate:create -- --name nome_da_migration
npm run db:migrate
npm run db:migrate:deploy
npm run db:seed
npm run db:studio
```

`db:migrate:create` gera o SQL sem aplicá-lo. `db:migrate` cria e aplica
migrations de desenvolvimento. `db:migrate:deploy` aplica migrations
existentes.

Ao subir o Docker, migrations pendentes são aplicadas antes da aplicação. A
seed garante o usuário inicial `admin`, com nome `Admin` e senha inicial
`admin`. A senha é armazenada como hash e não é redefinida quando o usuário já
existe.

## Qualidade de código

Execute pela raiz:

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
padrão do Material UI. A preferência é gerenciada pelo Zustand em
`apps/web/src/stores/theme` e persistida no `localStorage`.

## VS Code

Abra a raiz do monorepo:

```bash
code .
```

As configurações em `.vscode/settings.json` executam ESLint e Prettier ao
salvar. Não é necessário alterar as configurações globais do VS Code.

Se a pasta já estava aberta antes de uma alteração de configuração, execute
`Developer: Reload Window` e `ESLint: Restart ESLint Server`.
