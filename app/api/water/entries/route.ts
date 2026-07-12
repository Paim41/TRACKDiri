import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok, parseJson, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { waterEntrySchema } from "@/lib/validation";
import { publishRealtimeEvent } from "@/lib/realtime";

export async function GET() {
  const user = await requireUser();
  const entries = await prisma.waterEntry.findMany({
    where: { userId: user.id },
    orderBy: { consumedAt: "desc" },
    take: 100
  });
  return ok({ entries });
}

export async function POST(request: Request) {
  const user = await requireUser();
  try {
    const input = await parseJson(request, waterEntrySchema);
    const entry = await prisma.waterEntry.create({
      data: {
        userId: user.id,
        amountMl: input.amountMl,
        consumedAt: input.consumedAt ? new Date(input.consumedAt) : new Date(),
        timezone: input.timezone,
        clientMutationId: input.clientMutationId
      }
    });
    await publishRealtimeEvent({ type: "water.updated", userId: user.id, day: entry.consumedAt.toISOString().slice(0, 10) });
    return ok({ entry });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("DUPLICATE_MUTATION", "This glass was already recorded.", 409);
    }
    return fail("SERVER_ERROR", "A network error occurred.", 500);
  }
}
