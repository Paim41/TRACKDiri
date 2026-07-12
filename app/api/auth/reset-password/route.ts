import { ZodError } from "zod";
import { fail, ok, parseJson, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/password";
import { hashToken } from "@/lib/tokens";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, resetPasswordSchema);
    const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(input.token) } });
    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
      return fail("INVALID_TOKEN", "This password-reset link is invalid or expired.", 400);
    }
    const passwordHash = await hashPassword(input.password);
    await prisma.$transaction([
      prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
      prisma.session.updateMany({ where: { userId: reset.userId, revokedAt: null }, data: { revokedAt: new Date() } })
    ]);
    return ok({ reset: true });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    return fail("SERVER_ERROR", "A network error occurred.", 500);
  }
}
