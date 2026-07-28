import { config } from "dotenv";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const envPath = fileURLToPath(new URL("../compose/dev/.env", import.meta.url));
const isDocker = existsSync("/.dockerenv");

config({ path: envPath });

const setDefault = (name, value) => {
  if (!process.env[name]) {
    process.env[name] = value;
  }
};

const postgresUser = process.env.POSTGRES_USER ?? "app_db";
const postgresPassword = process.env.POSTGRES_PASSWORD ?? "app_db";
const postgresDatabase = process.env.POSTGRES_DB ?? "app_db";
const postgresHost = isDocker ? "postgres" : "localhost";
const postgresPort = isDocker ? "5432" : (process.env.POSTGRES_EXTERNAL_PORT ?? "5432");
const apiPort = isDocker ? "1001" : (process.env.API_EXTERNAL_PORT ?? "3001");
const webPort = isDocker ? "1002" : (process.env.WEB_EXTERNAL_PORT ?? "3002");

setDefault("NODE_ENV", "development");
setDefault("API_HOST", isDocker ? "0.0.0.0" : "127.0.0.1");
setDefault("API_PORT", apiPort);
setDefault("CORS_ORIGIN", `http://localhost:${process.env.WEB_EXTERNAL_PORT ?? "3002"}`);
setDefault("VITE_HOST", isDocker ? "0.0.0.0" : "127.0.0.1");
setDefault("VITE_PORT", webPort);
setDefault("VITE_API_URL", `http://localhost:${process.env.API_EXTERNAL_PORT ?? "3001"}`);
setDefault("CHOKIDAR_USEPOLLING", isDocker ? "true" : "false");
setDefault("CHOKIDAR_INTERVAL", "300");
setDefault("VITE_USE_POLLING", isDocker ? "true" : "false");
setDefault("VITE_WATCH_INTERVAL", "300");
setDefault(
  "DATABASE_URL",
  `postgresql://${encodeURIComponent(postgresUser)}:${encodeURIComponent(postgresPassword)}@${postgresHost}:${postgresPort}/${encodeURIComponent(postgresDatabase)}`,
);

const turboCommand = process.platform === "win32" ? "turbo.cmd" : "turbo";
const turbo = spawn(turboCommand, ["run", "dev", "--ui=stream"], {
  env: process.env,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    turbo.kill(signal);
  });
}

turbo.once("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

turbo.once("exit", (code, signal) => {
  if (signal) {
    process.exitCode = 1;
    return;
  }

  process.exitCode = code ?? 1;
});
