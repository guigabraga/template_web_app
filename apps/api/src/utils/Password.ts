import { compare, hash, truncates } from "bcryptjs";

type TPasswordMethod = "hash" | "compare";

const PasswordUtil = async (
  method: TPasswordMethod,
  password: string,
  passwordHash?: string,
): Promise<string | boolean> => {
  if (!password) {
    throw new Error("A senha é obrigatória.");
  }

  if (truncates(password)) {
    throw new Error("A senha não pode ultrapassar 72 bytes.");
  }

  if (method === "hash") {
    return hash(password, 12);
  }

  if (!passwordHash) {
    throw new Error("O hash da senha é obrigatório para realizar a comparação.");
  }

  return compare(password, passwordHash);
};

export { PasswordUtil, type TPasswordMethod };
