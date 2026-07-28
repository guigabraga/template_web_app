import { z } from "zod";

const emailSchema = z.email();
const passwordEncoder = new TextEncoder();

export const postAuthBodySchema = z
  .object({
    user: z
      .string()
      .trim()
      .min(1, "O usuário é obrigatório.")
      .refine((user) => !user.includes("@") || emailSchema.safeParse(user).success, "Informe um email válido."),
    pass: z
      .string()
      .min(1, "A senha é obrigatória.")
      .refine(
        (password) => passwordEncoder.encode(password).byteLength <= 72,
        "A senha não pode ultrapassar 72 bytes.",
      ),
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

export type TPostAuthUserData = {
  token: string;
  id: string;
  username: string | null;
  email: string | null;
  displayName: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TPostAuthResponse = THttpResponse<TPostAuthUserData>;
