import type { THttpResponse } from "@template-web-app/shared-types/auth";
import { type output, ZodError, type ZodType } from "zod";

const ValidateFieldsUtil = async <TSchema extends ZodType>(
  schema: TSchema,
  fields: unknown,
): Promise<THttpResponse<output<TSchema>>> => {
  try {
    const validatedFields = await schema.parseAsync(fields);

    return {
      status: true,
      message: "Campos validados com sucesso.",
      data: validatedFields,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        status: false,
        errorType: "VALIDATION_ERROR",
        message: error.issues[0]?.message ?? "Os campos enviados são inválidos.",
        data: undefined,
      };
    }

    return {
      status: false,
      errorType: "INTERNAL_ERROR",
      message: "Não foi possível validar os campos enviados.",
      data: undefined,
    };
  }
};

export { ValidateFieldsUtil };
