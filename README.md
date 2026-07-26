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

As alterações no código são detectadas automaticamente dentro dos containers.
A API reinicia quando um arquivo em `apps/api/src` é alterado, e o web utiliza
o HMR do Vite para atualizar a página ao alterar `apps/web/src`. O polling está
habilitado no ambiente `dev` para funcionar de forma consistente com o Docker
Desktop. Depois de alterar dependências, execute novamente
`npm run compose:dev:up` para atualizar o volume de `node_modules`.

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

O workspace `packages/db` centraliza o Prisma Client, o schema e as migrations.
A API importa o singleton pelo pacote `@template-web-app/db` e abre a conexão
com o PostgreSQL antes de iniciar o servidor.

O Prisma CLI lê as credenciais de `compose/dev/.env`. Com o PostgreSQL do
Docker em execução, use:

```bash
npm run db:generate
npm run db:migrate:create -- --name nome_da_migration
npm run db:migrate
npm run db:migrate:deploy
npm run db:studio
```

`db:migrate:create` gera o arquivo SQL sem aplicá-lo. `db:migrate` cria e aplica
migrations no desenvolvimento, e `db:migrate:deploy` aplica migrations já
existentes. Neste momento o schema não possui models e nenhuma tabela da
aplicação é criada.

Os mesmos comandos podem ser executados diretamente no workspace:

```bash
npm run generate --workspace @template-web-app/db
npm run db:migrate:create --workspace @template-web-app/db -- --name nome_da_migration
npm run db:migrate --workspace @template-web-app/db
npm run db:migrate:deploy --workspace @template-web-app/db
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

Durante o desenvolvimento, `tsx` observa os arquivos TypeScript em `src`. O
pacote de banco é gerado e compilado antes da API. Após o build, o comando
`start` executa o JavaScript gerado em `dist/Server.js`.

Também é possível chamar diretamente o workspace:

```bash
npm run dev --workspace @template-web-app/api
npm run build --workspace @template-web-app/api
npm run start --workspace @template-web-app/api
npm run typecheck --workspace @template-web-app/api
```

Para verificar a API em execução, acesse:

```text
GET http://localhost:1001/health
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
