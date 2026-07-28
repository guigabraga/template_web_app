# Instruções Do Projeto

Estas regras se aplicam a todo o monorepo. Ao trabalhar na API, leia também
`SKILLS/build-api-route/SKILL.md` antes de criar ou alterar rotas, controllers,
services, repositories, utils ou middlewares.

## Convenções Gerais

- Escreva funções como arrow functions atribuídas a `const`.
- Prefixe aliases de tipo com `T` e interfaces próprias com `I`.
- Use dois espaços, aspas duplas e ponto e vírgula.
- Preserve ESM e use a extensão `.js` nos imports relativos da API.
- Não renomeie arquivos apenas para acompanhar o nome de uma função.
- Mantenha funções e seus types públicos em uma única declaração de export no
  final do arquivo. Não crie vários exports para o mesmo módulo.

```ts
export { PostAuthController, type TPostAuthController };
```

## Arquitetura Da API

O fluxo obrigatório é:

```text
Routes.ts -> Middleware -> Controller -> Service -> Repository
                                      -> Util
```

### Routes

- Declare todas as rotas Express em `apps/api/src/Routes.ts`.
- A rota deve apenas encadear middlewares e o controller.
- Não implemente validação, regra de negócio ou query Prisma em `Routes.ts`.
- Use middleware somente em `Routes.ts`, antes do controller que ele protege.

### Domínio Dominante

O primeiro segmento do path define o domínio e o arquivo do controller:

- `/auth` e `/auth/refresh` pertencem a `controllers/Auth.ts`.
- `/user/:id` e `/user/:id/status` pertencem a `controllers/User.ts`.
- `/users` pertence a `controllers/Users.ts`; singular e plural são domínios
  diferentes quando os paths forem diferentes.

Todos os métodos e variações de um mesmo domínio ficam no mesmo controller.

### Nomes Das Funções

Use `MetodoDominioPathsSufixo`, em PascalCase:

- `POST /auth` -> `PostAuthController` e `PostAuthService`.
- `GET /auth/refresh` -> `GetAuthRefreshController` e
  `GetAuthRefreshService`.
- `GET /user/:id` -> `GetUserIdController` e `GetUserIdService`.
- `PATCH /user/:id/status` -> `PatchUserIdStatusController` e
  `PatchUserIdStatusService`.

Use estes sufixos obrigatórios:

- Controller: `NomeFuncaoController`
- Service: `NomeFuncaoService`
- Repository: `NomeFuncaoRepositorie`
- Util: `NomeFuncaoUtil`
- Middleware: `NomeFuncaoMiddleware`

### Controllers

- Controllers recebem `req`, chamam exatamente o service do fluxo e constroem
  a resposta com `res`.
- Controllers controlam status HTTP, headers e serialização da resposta.
- Controllers não validam campos, não executam regras de negócio, não acessam
  Prisma e não chamam repositories ou utils diretamente.
- Um arquivo de controller agrupa todas as operações do domínio dominante.

### Services

- Crie um service por função de controller.
- Organize services em `apps/api/src/services/<dominio>/`.
- O service executa validação, autorização, regras de negócio e orquestra
  repositories e utils.
- O service não recebe nem utiliza objetos `Request` ou `Response` do Express.
- Retorne o contrato `THttpResponse` específico da operação, com sucesso ou
  erro, para o controller traduzir em status HTTP.

### Repositories

- Toda query Prisma deve existir em `apps/api/src/repositories/`.
- Controllers, services, utils e middlewares não importam `prisma`.
- Antes de criar um repository, procure um existente que represente a mesma
  consulta.
- Para uma variação pequena, amplie os parâmetros e types do repository
  existente sem quebrar seus usos.
- Para uma consulta com semântica, seleção, relações ou comportamento
  substancialmente diferentes, crie outro repository.
- Cada repository retorna somente dados do banco; regras de negócio pertencem
  ao service.

### Utils

- Coloque em `apps/api/src/utils/` apenas funções reutilizáveis por mais de um
  fluxo ou domínio.
- Utils não conhecem Express e não substituem services.
- Mantenha parâmetros e retornos explícitos e tipados.

### Middlewares

- Middlewares tratam apenas preocupações transversais do fluxo Express, como
  autenticação por token.
- Middlewares respondem a falhas próprias ou chamam `next()`.
- Registre middlewares somente em `Routes.ts`; não os invoque manualmente em
  controllers ou services.

## Validação Obrigatória

Após mudanças na API, execute:

```bash
npm run lint
npm run typecheck
npm run build
```
