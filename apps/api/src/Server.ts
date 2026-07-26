import { prisma } from "@template-web-app/db";
import App from "./App.js";

const port = Number(process.env.API_PORT ?? 1001);
const host = process.env.API_HOST ?? "127.0.0.1";

await prisma.$connect();

const server = App.listen(port, host);

const shutdown = async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  await prisma.$disconnect();
};

process.once("SIGINT", () => {
  void shutdown();
});

process.once("SIGTERM", () => {
  void shutdown();
});
