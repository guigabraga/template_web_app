import type { THttpResponse, TPostAuthBody } from "@template-web-app/shared-types/auth";
import type { Request, Response } from "express";

type TPostAuthRequest = Request<Record<string, never>, THttpResponse, TPostAuthBody>;
type TPostAuthResponse = Response<THttpResponse>;
type TPostAuthController = (request: TPostAuthRequest, response: TPostAuthResponse) => Promise<void>;

const PostAuthController: TPostAuthController = async (req, _res) => {
  const body = req.body;
  void _res;
  void body;
};

export { PostAuthController };
