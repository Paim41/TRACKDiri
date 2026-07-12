import { ZodError } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok, parseJson, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { pushSubscriptionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await requireUser();
  try {
    const input = await parseJson(request, pushSubscriptionSchema);
    const subscription = await prisma.pushSubscription.upsert({
      where: { endpoint: input.endpoint },
      update: {
        userId: user.id,
        encryptedKeys: input.keys,
        deviceLabel: input.deviceLabel,
        userAgent: request.headers.get("user-agent"),
        active: true,
        lastUsedAt: new Date()
      },
      create: {
        userId: user.id,
        endpoint: input.endpoint,
        encryptedKeys: input.keys,
        deviceLabel: input.deviceLabel,
        userAgent: request.headers.get("user-agent"),
        active: true,
        lastUsedAt: new Date()
      }
    });
    return ok({ subscription });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    return fail("SERVER_ERROR", "A network error occurred.", 500);
  }
}
