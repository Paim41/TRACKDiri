import { Theme, MeasurementSystem } from "@prisma/client";
import { ZodError, z } from "zod";
import { fail, ok, parseJson, validationError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/);

const accountSchema = z.object({
  name: z.string().trim().min(2, "Display name is required.").max(120).optional(),
  timezone: z.string().trim().min(1).max(80).optional(),
  measurementSystem: z.nativeEnum(MeasurementSystem).optional(),
  theme: z.nativeEnum(Theme).optional(),
  reducedMotion: z.boolean().optional(),
  notificationEnabled: z.boolean().optional(),
  quietHoursStart: timeSchema.optional(),
  quietHoursEnd: timeSchema.optional()
});

export async function PATCH(request: Request) {
  const user = await requireUser();

  try {
    const input = await parseJson(request, accountSchema);
    const { name, ...preferenceInput } = input;

    const [updatedUser, preference] = await prisma.$transaction([
      name
        ? prisma.user.update({
            where: { id: user.id },
            data: { name }
          })
        : prisma.user.findUniqueOrThrow({ where: { id: user.id } }),
      prisma.userPreference.upsert({
        where: { userId: user.id },
        update: preferenceInput,
        create: { userId: user.id, ...preferenceInput }
      })
    ]);

    return ok({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerifiedAt: updatedUser.emailVerifiedAt
      },
      preference
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    return fail("SERVER_ERROR", "TRACKDiri could not update your account.", 500);
  }
}
