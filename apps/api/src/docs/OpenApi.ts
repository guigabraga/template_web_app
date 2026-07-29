import { postAuthBodySchema } from "@template-web-app/shared-types/auth";
import { toJSONSchema } from "zod";

const postAuthRequestSchema = toJSONSchema(postAuthBodySchema, {
  io: "input",
});

const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Template Web App API",
    version: "1.0.0",
    description: "Documentação interativa dos endpoints da API.",
  },
  servers: [
    {
      url: "/",
      description: "Servidor atual",
    },
  ],
  tags: [
    {
      name: "Autenticação",
      description: "Operações de autenticação de usuários.",
    },
  ],
  paths: {
    "/auth": {
      post: {
        tags: ["Autenticação"],
        summary: "Autenticar usuário",
        description: "Valida as credenciais e retorna os dados do usuário com um token JWT.",
        operationId: "PostAuth",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: postAuthRequestSchema,
              examples: {
                username: {
                  summary: "Autenticação com nome de usuário",
                  value: {
                    user: "usuario",
                    pass: "senha-segura",
                  },
                },
                email: {
                  summary: "Autenticação com email",
                  value: {
                    user: "usuario@example.com",
                    pass: "senha-segura",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Usuário autenticado com sucesso.",
            headers: {
              "Cache-Control": {
                $ref: "#/components/headers/CacheControl",
              },
              Pragma: {
                $ref: "#/components/headers/Pragma",
              },
            },
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PostAuthSuccess",
                },
              },
            },
          },
          "400": {
            description: "Campos enviados inválidos.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiError",
                },
                example: {
                  status: false,
                  errorType: "VALIDATION_ERROR",
                  message: "O usuário é obrigatório.",
                },
              },
            },
          },
          "401": {
            description: "Credenciais inválidas ou usuário inativo.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiError",
                },
                example: {
                  status: false,
                  errorType: "UNAUTHORIZED",
                  message: "Usuário ou senha incorretos.",
                },
              },
            },
          },
          "500": {
            description: "Erro interno ao processar a autenticação.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiError",
                },
                example: {
                  status: false,
                  errorType: "INTERNAL_ERROR",
                  message: "Não foi possível processar a autenticação.",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    headers: {
      CacheControl: {
        description: "Impede o armazenamento da resposta de autenticação em cache.",
        schema: {
          type: "string",
          example: "no-store",
        },
      },
      Pragma: {
        description: "Compatibilidade com clientes HTTP/1.0 sem cache.",
        schema: {
          type: "string",
          example: "no-cache",
        },
      },
    },
    schemas: {
      PostAuthSuccess: {
        type: "object",
        additionalProperties: false,
        required: ["status", "message", "data"],
        properties: {
          status: {
            type: "boolean",
            const: true,
          },
          message: {
            type: "string",
            example: "Usuário autenticado com sucesso.",
          },
          data: {
            $ref: "#/components/schemas/PostAuthUser",
          },
        },
      },
      PostAuthUser: {
        type: "object",
        additionalProperties: false,
        required: [
          "token",
          "id",
          "username",
          "email",
          "displayName",
          "isActive",
          "lastLoginAt",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          token: {
            type: "string",
            description: "Token JWT para autenticação nas rotas protegidas.",
          },
          id: {
            type: "string",
            format: "uuid",
          },
          username: {
            type: ["string", "null"],
          },
          email: {
            type: ["string", "null"],
            format: "email",
          },
          displayName: {
            type: ["string", "null"],
          },
          isActive: {
            type: "boolean",
          },
          lastLoginAt: {
            type: ["string", "null"],
            format: "date-time",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      ApiError: {
        type: "object",
        additionalProperties: false,
        required: ["status", "errorType", "message"],
        properties: {
          status: {
            type: "boolean",
            const: false,
          },
          errorType: {
            type: "string",
            enum: ["VALIDATION_ERROR", "UNAUTHORIZED", "INTERNAL_ERROR"],
          },
          message: {
            type: "string",
          },
        },
      },
    },
  },
};

export { openApiDocument };
