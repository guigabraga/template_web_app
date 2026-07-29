---
name: build-api-route
description: Constrói, altera e documenta no Scalar rotas Express da API do template_web_app seguindo o fluxo Routes, Middleware, Controller, Service, Repository e Util. Use ao criar endpoints, adicionar métodos ou variações de paths, reorganizar lógica de domínio, criar queries Prisma, adicionar validações reutilizáveis ou revisar se uma rota em apps/api segue as convenções arquiteturais e de documentação do projeto.
---

# Construir Rota Da API

Aplicar as regras do `AGENTS.md` da raiz e manter este fluxo:

```text
Routes.ts -> Middleware -> Controller -> Service -> Repository
                                      -> Util
```

## 1. Determinar O Domínio

Usar o primeiro segmento do path como domínio dominante:

| Rota                     | Controller             |
| ------------------------ | ---------------------- |
| `POST /auth`             | `controllers/Auth.ts`  |
| `POST /auth/refresh`     | `controllers/Auth.ts`  |
| `GET /user/:id`          | `controllers/User.ts`  |
| `PATCH /user/:id/status` | `controllers/User.ts`  |
| `GET /users`             | `controllers/Users.ts` |

Não criar um controller por variação do path. Agrupar no mesmo arquivo todos os
métodos do domínio dominante.

## 2. Derivar Os Nomes

Formar o nome com `Metodo + Dominio + Paths`, removendo `/` e `:` e usando
PascalCase. Acrescentar o sufixo da camada:

| Rota                     | Controller                    | Service                    |
| ------------------------ | ----------------------------- | -------------------------- |
| `POST /auth`             | `PostAuthController`          | `PostAuthService`          |
| `POST /auth/refresh`     | `PostAuthRefreshController`   | `PostAuthRefreshService`   |
| `GET /user/:id`          | `GetUserIdController`         | `GetUserIdService`         |
| `PATCH /user/:id/status` | `PatchUserIdStatusController` | `PatchUserIdStatusService` |

Aplicar os sufixos `Controller`, `Service`, `Repositorie`, `Util` e
`Middleware`. Não renomear o arquivo apenas porque o símbolo recebeu o sufixo.

## 3. Definir O Contrato

1. Procurar primeiro um schema e types existentes em `packages/shared-types`.
2. Criar ou ampliar o contrato compartilhado quando request ou response forem
   usados pela API e pelo web.
3. Prefixar aliases com `T` e interfaces próprias com `I`.
4. Modelar o retorno do service como uma especialização de `THttpResponse`.
5. Não confiar na tipagem do body antes da validação em runtime; receber dados
   externos como `unknown` quando apropriado.

## 4. Preparar Repository E Utils

### Repository

Usar repository para toda operação Prisma:

```ts
const GetUserRepositorie = async (where: TGetUserWhere): Promise<User | null> => prisma.user.findUnique({ where });

export { GetUserRepositorie, type TGetUserWhere };
```

Antes de criar outro:

1. Pesquisar repositories existentes.
2. Ampliar types ou parâmetros quando a mudança for pequena e preservar a
   semântica da consulta.
3. Criar outro repository quando seleção, relações, cardinalidade ou objetivo
   forem substancialmente diferentes.

Nunca importar `prisma` no controller, service, util ou middleware.

### Util

Criar util somente para comportamento reutilizável:

```ts
const ValidateFieldsUtil = async <TSchema extends ZodType>(
  schema: TSchema,
  fields: unknown,
): Promise<THttpResponse<output<TSchema>>> => {
  // Implementação reutilizável.
};

export { ValidateFieldsUtil };
```

Não mover regra específica de um domínio para utils.

## 5. Implementar O Service

Criar um arquivo por operação em `apps/api/src/services/<dominio>/`.

Responsabilidades:

- validar entrada;
- executar autorização e regra de negócio;
- chamar repositories;
- chamar utils;
- construir `THttpResponse` de sucesso ou erro;
- não acessar `Request`, `Response` ou status HTTP do Express.

Exemplo estrutural:

```ts
const PostAuthService = async (data: unknown): Promise<TPostAuthResponse> => {
  const validation = await ValidateFieldsUtil(postAuthBodySchema, data);

  if (!validation.status) {
    return validation;
  }

  const user = await GetUserRepositorie({
    username: validation.data.user,
  });

  // Continuar a regra do domínio e retornar TPostAuthResponse.
};

export { PostAuthService };
```

## 6. Implementar O Controller

Manter o controller como adaptador HTTP:

1. Ler `req.params`, `req.query`, `req.body`, headers ou `res.locals`.
2. Chamar somente o service correspondente.
3. Traduzir o resultado do service em status e headers HTTP.
4. Enviar a resposta.

Não validar com Zod, executar regra de negócio, acessar Prisma ou chamar
repository/util diretamente.

```ts
const PostAuthController: TPostAuthController = async (req, res) => {
  const responseService = await PostAuthService(req.body);
  const httpStatus = responseService.status ? 200 : 401;

  res.status(httpStatus).json(responseService);
};

export { PostAuthController, type TPostAuthController, type TPostAuthRequest, type TPostAuthControllerResponse };
```

## 7. Registrar Em Routes.ts

Manter apenas a composição Express:

```ts
Routes.post("/auth", PostAuthController);
Routes.get("/user/:id", ValidateTokenMiddleware, GetUserIdController);
```

Usar middlewares somente aqui. O middleware valida sua preocupação transversal,
responde à própria falha ou chama `next()`.

## 8. Documentar No Scalar

Documentar toda nova rota em `apps/api/src/docs/OpenApi.ts` na mesma alteração
que implementa o endpoint. Atualizar a operação existente sempre que o contrato
ou comportamento HTTP mudar.

Incluir:

- método, path, tag, resumo e `operationId`;
- parâmetros de path e query;
- body, content type e exemplos;
- todos os status HTTP possíveis e seus schemas de resposta;
- headers e requisitos de autenticação aplicáveis.

Reutilizar schemas Zod de `packages/shared-types` com `toJSONSchema` quando
existirem. Evitar duplicar manualmente contratos compartilhados.

Considerar a rota incompleta até confirmar que ela aparece corretamente em
`GET /docs` e que a execução interativa aponta para o endpoint esperado.

## 9. Organizar Exports

Manter uma única declaração de export no final de cada arquivo para a função e
seus types públicos:

```ts
export {
  GetUserRepositorie,
  type TGetUserByEmailWhere,
  type TGetUserByIdWhere,
  type TGetUserByUsernameWhere,
  type TGetUserWhere,
};
```

Não espalhar `export` pelas declarações nem criar múltiplos blocos de export no
mesmo módulo.

## 10. Validar

Executar:

```bash
npm run lint
npm run typecheck
npm run build
```

Quando a rota depender de PostgreSQL, JWT ou middleware, testar também o fluxo
real no container dev, incluindo sucesso e erros esperados.

Testar `GET /docs` após criar ou alterar uma rota e conferir a operação
documentada no Scalar.
