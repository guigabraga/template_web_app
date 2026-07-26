# Docker Compose

Cada ambiente mantém seu próprio `docker-compose.yml` e suas variáveis
centralizadas:

```text
compose/
  dev/
  homolog/
  prod/
```

Somente `dev` está configurado. Os arquivos de homologação e produção são
placeholders válidos e não iniciam serviços.

## Desenvolvimento

As portas internas são fixas:

- API: `1001`
- Web: `1002`
- PostgreSQL: `5432`

As portas expostas em `localhost` são definidas em `compose/dev/.env`.

Ao executar `compose:dev:up`, o serviço `dependencies` roda
`npm ci --include=dev` antes de iniciar a API e o web. A instalação inclui todos
os workspaces do monorepo e utiliza um volume de cache do npm para reduzir
downloads nas próximas inicializações.

O código-fonte do monorepo é montado nos containers. A API reinicia
automaticamente ao alterar arquivos em `apps/api/src`, e o web aplica as
alterações de `apps/web/src` pelo HMR do Vite. Os dois monitores usam polling
no ambiente Docker para detectar alterações feitas no host.

Depois de adicionar ou remover uma dependência, execute novamente
`npm run compose:dev:up` para atualizar o volume de `node_modules`.

Na raiz do projeto:

```bash
cp compose/dev/.env.example compose/dev/.env
npm run compose:dev:up
npm run compose:dev:ps
npm run compose:dev:logs
npm run compose:dev:down
```

Para remover também os dados persistidos do PostgreSQL:

```bash
npm run compose:dev:reset
```
