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

export type TPostAuthBody = z.infer<typeof postAuthBodySchema>;

export type THttpResponseSuccess<TData = undefined> = {
  status: true;
  message: string;
  data: TData;
};

export type THttpResponseError<TData = undefined> = {
  status: false;
  errorType: string;
  message: string;
  data: TData;
};

export type THttpResponse<TSuccessData = undefined, TErrorData = undefined> =
  THttpResponseSuccess<TSuccessData> | THttpResponseError<TErrorData>;

export type TPostAuthResponse = THttpResponse;
