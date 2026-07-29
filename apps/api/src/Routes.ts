import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import { Router, type Response } from "express";
import { uptime } from "node:process";
import { PostAuthController } from "./controllers/Auth.js";
import { openApiDocument } from "./docs/OpenApi.js";

const Routes = Router();
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3002,http://127.0.0.1:3002")
  .split(",")
  .map((origin) => origin.trim());

Routes.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

Routes.get("/health", (_, res: Response) => {
  res.status(200).json({
    status: true,
    message: "API operacional",
    data: {
      uptime: uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

Routes.get(
  "/docs",
  apiReference({
    content: openApiDocument,
    pageTitle: "Template Web App API",
  }),
);

Routes.post("/auth", PostAuthController);

export default Routes;
