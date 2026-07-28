import { postAuthBodySchema, type PostAuthBody, type PostAuthResponse } from "@template-web-app/shared-types/auth";

export type AuthHttpMethods = {
  fetch: typeof globalThis.fetch;
};

export type AuthConfig = {
  baseUrl: string;
  methods?: AuthHttpMethods;
};

export class Auth {
  private readonly baseUrl: string;
  private readonly methods: AuthHttpMethods;

  constructor({
    baseUrl,
    methods = {
      fetch: globalThis.fetch.bind(globalThis),
    },
  }: AuthConfig) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.methods = methods;
  }

  post = async (body: PostAuthBody): Promise<PostAuthResponse> => {
    try {
      const payload = postAuthBodySchema.parse(body);
      const response = await this.methods.fetch(`${this.baseUrl}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as PostAuthResponse;

      if (!response.ok || !result.status) {
        throw new Error(result.message || `Não foi possível autenticar. Status: ${response.status}.`);
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Não foi possível autenticar.", {
        cause: error,
      });
    }
  };
}

export const authService = new Auth({
  baseUrl: import.meta.env.VITE_API_URL,
});
