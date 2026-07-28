import type { HttpResponse, PostAuthBody } from "@template-web-app/shared-types/auth";
import type { Request, Response } from "express";

type PostAuthRequest = Request<Record<string, never>, HttpResponse, PostAuthBody>;
type PostAuthResponse = Response<HttpResponse>;
type PostAuthController = (request: PostAuthRequest, response: PostAuthResponse) => Promise<void>;

const PostAuth: PostAuthController = async () => {};

export { PostAuth };
