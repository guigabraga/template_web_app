import { postAuthBodySchema, type TPostAuthBody, type TPostAuthResponse } from "@template-web-app/shared-types/auth";

type TAuthHttpMethods = {
  fetch: typeof globalThis.fetch;
};

type TAuthConfig = {
  baseUrl: string;
  methods?: TAuthHttpMethods;
};

class Auth {
  private readonly baseUrl: string;
  private readonly methods: TAuthHttpMethods;

  constructor({
    baseUrl,
    methods = {
      fetch: globalThis.fetch.bind(globalThis),
    },
  }: TAuthConfig) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.methods = methods;
  }

  post = async (body: TPostAuthBody): Promise<TPostAuthResponse> => {
    try {
      const payload = postAuthBodySchema.parse(body);
      const response = await this.methods.fetch(`${this.baseUrl}/auth`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as TPostAuthResponse;

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

const authService = new Auth({
  baseUrl: import.meta.env.VITE_API_URL,
});

export { Auth, authService, type TAuthConfig, type TAuthHttpMethods };
