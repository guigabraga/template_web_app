import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { randomUUID } from "node:crypto";

type TJwtUser = {
  id: string;
};

type TJwtPayload = JWTPayload & {
  sub: string;
  iat: number;
  exp: number;
  jti: string;
};

type TJwtConfig = {
  secret: Uint8Array;
  issuer: string;
  audience: string;
  expiresInSeconds: number;
};

const GetJwtConfigUtil = (): TJwtConfig => {
  const secretValue = process.env.JWT_SECRET;
  const issuer = process.env.JWT_ISSUER ?? "template-web-app-api";
  const audience = process.env.JWT_AUDIENCE ?? "template-web-app-web";
  const expiresInSeconds = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 900);

  if (!secretValue || new TextEncoder().encode(secretValue).byteLength < 32) {
    throw new Error("JWT_SECRET deve possuir pelo menos 32 bytes.");
  }

  if (!Number.isSafeInteger(expiresInSeconds) || expiresInSeconds <= 0) {
    throw new Error("JWT_EXPIRES_IN_SECONDS deve ser um número inteiro positivo.");
  }

  return {
    secret: new TextEncoder().encode(secretValue),
    issuer,
    audience,
    expiresInSeconds,
  };
};

const CreateJwtUtil = async (user: TJwtUser): Promise<string> => {
  const { secret, issuer, audience, expiresInSeconds } = GetJwtConfigUtil();
  const issuedAt = Math.floor(Date.now() / 1000);

  return new SignJWT()
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(user.id)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + expiresInSeconds)
    .setJti(randomUUID())
    .sign(secret);
};

const ValidateJwtUtil = async (token: string): Promise<TJwtPayload> => {
  const { secret, issuer, audience } = GetJwtConfigUtil();
  const { payload, protectedHeader } = await jwtVerify<TJwtPayload>(token, secret, {
    algorithms: ["HS256"],
    issuer,
    audience,
  });

  if (
    protectedHeader.typ !== "JWT" ||
    typeof payload.sub !== "string" ||
    typeof payload.iat !== "number" ||
    typeof payload.exp !== "number" ||
    typeof payload.jti !== "string"
  ) {
    throw new Error("O token não possui os dados obrigatórios.");
  }

  return payload;
};

export { CreateJwtUtil, ValidateJwtUtil, type TJwtPayload, type TJwtUser };
