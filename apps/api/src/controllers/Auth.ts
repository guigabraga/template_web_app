import type { TPostAuthResponse } from "@template-web-app/shared-types/auth";
import type { Request, Response } from "express";
import { PostAuthService } from "../services/auth/PostAuth.js";

type TPostAuthRequest = Request<Record<string, never>, TPostAuthResponse, unknown>;
type TPostAuthControllerResponse = Response<TPostAuthResponse>;
type TPostAuthController = (request: TPostAuthRequest, response: TPostAuthControllerResponse) => Promise<void>;

const errorHttpStatus: Record<string, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

const PostAuthController: TPostAuthController = async (req, res) => {
  const responseService = await PostAuthService(req.body);
  const httpStatus = responseService.status ? 200 : (errorHttpStatus[responseService.errorType] ?? 500);

  res.set({
    "Cache-Control": "no-store",
    Pragma: "no-cache",
  });
  res.status(httpStatus).json(responseService);
};

export { PostAuthController };
