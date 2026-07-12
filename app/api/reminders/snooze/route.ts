import { z, ZodError } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok, parseJson, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const snoozeSchema = z.object({
  reminderId: z.string().min(1),
  minutes: z.union([z.literal(10), z.literal(20), z.literal(30), z.literal(60)])
});

export async function POST(request: Request) {
  const user = await requireUser();
  try {
    const input = await parseJson(request, snoozeSchema);
    const reminder = await prisma.reminder.findFirst({ where: { id: input.reminderId, userId: user.id } });
    if (!reminder) return fail("NOT_FOUND", "Reminder not found.", 404);
    const updated = await prisma.reminder.update({
      where: { id: reminder.id },
      data: {
        status: "SNOOZED",
        snoozedUntil: new Date(Date.now() + input.minutes * 60 * 1000)
      }
    });
    return ok({ reminder: updated });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    return fail("SERVER_ERROR", "A network error occurred.", 500);
  }
}
