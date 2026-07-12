import { UserStatus } from "@prisma/client";
import { ZodError } from "zod";
import { createSession } from "@/lib/auth";
import { fail, ok, parseJson, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, loginSchema);
    const limited = rateLimit(`login:${input.email}`, 8, 15 * 60 * 1000);
    if (!limited.ok) return fail("RATE_LIMITED", "Too many attempts. Please try again later.", 429);
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) return fail("INVALID_CREDENTIALS", "Incorrect email or password.", 401);
    const valid = await verifyPassword(user.passwordHash, input.password);
    if (!valid) return fail("INVALID_CREDENTIALS", "Incorrect email or password.", 401);
    if (user.status !== UserStatus.ACTIVE) return fail("EMAIL_NOT_VERIFIED", "Please verify your email before logging in.", 403);
    await createSession(user.id, input.remember);
    await prisma.securityEvent.create({ data: { userId: user.id, eventType: "LOGIN", userAgent: request.headers.get("user-agent") } });
    return ok({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    return fail("SERVER_ERROR", "A network error occurred.", 500);
  }
}
