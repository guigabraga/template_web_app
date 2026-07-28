import { postAuthBodySchema, type TPostAuthResponse } from "@template-web-app/shared-types/auth";
import { GetUserRepositorie } from "../../repositories/GetUser.js";
import { CreateJwtUtil } from "../../utils/Jwt.js";
import { PasswordUtil } from "../../utils/Password.js";
import { ValidateFieldsUtil } from "../../utils/ValidateFields.js";

const dummyPasswordHash = "$2b$12$n02zvOMKm0BC6wJTKAO1/emlpBp6j0lHP0WFlk6ah9zv/J4FCJ2Ua";

const PostAuthService = async (data: unknown): Promise<TPostAuthResponse> => {
  const responseValidateFields = await ValidateFieldsUtil(postAuthBodySchema, data);

  if (!responseValidateFields.status) {
    return responseValidateFields;
  }

  try {
    const user = await GetUserRepositorie({
      username: responseValidateFields.data.user,
    });
    const passwordHash = user?.passwordHash ?? dummyPasswordHash;
    const isPasswordValid = await PasswordUtil("compare", responseValidateFields.data.pass, passwordHash);

    if (!user || !user.isActive || isPasswordValid !== true) {
      return {
        status: false,
        errorType: "UNAUTHORIZED",
        message: "Usuário ou senha incorretos.",
        data: undefined,
      };
    }

    const token = await CreateJwtUtil(user);

    return {
      status: true,
      message: "Usuário autenticado com sucesso.",
      data: {
        token,
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Falha ao processar a autenticação.", error);

    return {
      status: false,
      errorType: "INTERNAL_ERROR",
      message: "Não foi possível processar a autenticação.",
      data: undefined,
    };
  }
};

export { PostAuthService };
