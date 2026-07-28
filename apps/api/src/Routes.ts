import cors from "cors";
import { Router, type Response } from "express";
import { uptime } from "node:process";
import { PostAuthController } from "./controllers/Auth.js";

const Routes = Router();
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3002").split(",").map((origin) => origin.trim());

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

Routes.post("/auth", PostAuthController);

export default Routes;
