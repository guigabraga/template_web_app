import { z } from "zod";

const emailSchema = z.email();

export const postAuthBodySchema = z
  .object({
    user: z
      .string()
      .trim()
      .min(1, "O usuário é obrigatório.")
      .refine((user) => !user.includes("@") || emailSchema.safeParse(user).success, "Informe um email válido."),
    pass: z.string().min(1, "A senha é obrigatória."),
  })
  .strict();

export type PostAuthBody = z.infer<typeof postAuthBodySchema>;

export type HttpResponseSuccess<TData = undefined> = {
  status: true;
  message: string;
  data: TData;
};

export type HttpResponseError<TData = undefined> = {
  status: false;
  errorType: string;
  message: string;
  data: TData;
};

export type HttpResponse<TSuccessData = undefined, TErrorData = undefined> =
  HttpResponseSuccess<TSuccessData> | HttpResponseError<TErrorData>;

export type PostAuthResponse = HttpResponse;
