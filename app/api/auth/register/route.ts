import { Prisma, UserStatus } from "@prisma/client";
import { ZodError } from "zod";
import { fail, ok, parseJson, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validation";
import { addHours, createToken, hashToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const limited = rateLimit(`register:${request.headers.get("x-forwarded-for") ?? "local"}`, 5, 15 * 60 * 1000);
    if (!limited.ok) return fail("RATE_LIMITED", "Too many attempts. Please try again later.", 429);
    const input = await parseJson(request, registerSchema);
    const passwordHash = await hashPassword(input.password);
    const token = createToken();
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        status: UserStatus.PENDING_VERIFICATION,
        preference: { create: {} },
        waterSetting: { create: {} },
        verificationTokens: {
          create: {
            tokenHash: hashToken(token),
            expiresAt: addHours(new Date(), 24)
          }
        }
      }
    });
    await sendVerificationEmail(user.email, token);
    await prisma.securityEvent.create({
      data: { userId: user.id, eventType: "REGISTERED", userAgent: request.headers.get("user-agent") }
    });
    return ok({ id: user.id, email: user.email });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("DUPLICATE_EMAIL", "This email is already registered.", 409);
    }
    return fail("SERVER_ERROR", "A network error occurred.", 500);
  }
}
