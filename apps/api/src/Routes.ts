import { Router, type Response } from "express";
import { uptime } from "node:process";
import { PostAuthController } from "./controllers/Auth.js";

const Routes = Router();

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
