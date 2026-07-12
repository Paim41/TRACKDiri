import { isStrongPassword, validatePasswordStrength } from "@/lib/password-strength";

export { isStrongPassword, validatePasswordStrength };

const secret = process.env.ARGON2_SECRET ? Buffer.from(process.env.ARGON2_SECRET) : undefined;

export async function hashPassword(password: string) {
  const argon2 = await import("argon2");
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 3,
    parallelism: 1,
    secret
  });
}

export async function verifyPassword(hash: string, password: string) {
  const argon2 = await import("argon2");
  return argon2.verify(hash, password, { secret });
}
