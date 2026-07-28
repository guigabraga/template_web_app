import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

config({
  path: fileURLToPath(new URL("../../compose/dev/.env", import.meta.url)),
});

const { DATABASE_URL, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_EXTERNAL_PORT } = process.env;

const localDatabaseUrl =
  POSTGRES_USER && POSTGRES_PASSWORD && POSTGRES_DB && POSTGRES_EXTERNAL_PORT
    ? `postgresql://${encodeURIComponent(POSTGRES_USER)}:${encodeURIComponent(POSTGRES_PASSWORD)}@localhost:${POSTGRES_EXTERNAL_PORT}/${encodeURIComponent(POSTGRES_DB)}`
    : undefined;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: DATABASE_URL ?? localDatabaseUrl,
  },
});
