import type { THttpResponse } from "@template-web-app/shared-types/auth";
import type { NextFunction, Request, Response } from "express";
import { ValidateJwtUtil, type TJwtPayload } from "../utils/Jwt.js";

type TValidateTokenLocals = {
  auth: TJwtPayload;
};

type TValidateTokenResponse = Response<THttpResponse, TValidateTokenLocals>;
type TValidateTokenMiddleware = (
  request: Request,
  response: TValidateTokenResponse,
  next: NextFunction,
) => Promise<void>;

const ValidateTokenMiddleware: TValidateTokenMiddleware = async (req, res, next) => {
  const authorization = req.header("authorization");
  const [scheme, token, extraValue] = authorization?.trim().split(/\s+/) ?? [];

  if (scheme !== "Bearer" || !token || extraValue) {
    res.status(401).json({
      status: false,
      errorType: "UNAUTHORIZED",
      message: "Token de autenticação ausente ou inválido.",
      data: undefined,
    });
    return;
  }

  try {
    res.locals.auth = await ValidateJwtUtil(token);
    next();
  } catch {
    res.status(401).json({
      status: false,
      errorType: "UNAUTHORIZED",
      message: "Token de autenticação ausente ou inválido.",
      data: undefined,
    });
  }
};

export { ValidateTokenMiddleware, type TValidateTokenLocals };
