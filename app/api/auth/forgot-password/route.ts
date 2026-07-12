import { ZodError } from "zod";
import { fail, ok, parseJson, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { addHours, createToken, hashToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, forgotPasswordSchema);
    const limited = rateLimit(`forgot:${input.email}`, 4, 60 * 60 * 1000);
    if (!limited.ok) return fail("RATE_LIMITED", "Too many attempts. Please try again later.", 429);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (user) {
      const token = createToken();
      await prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash: hashToken(token), expiresAt: addHours(new Date(), 2) }
      });
      await sendPasswordResetEmail(user.email, token);
    }
    return ok({ sent: true });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    return fail("SERVER_ERROR", "A network error occurred.", 500);
  }
}
