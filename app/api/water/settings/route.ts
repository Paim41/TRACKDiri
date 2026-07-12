import { ZodError } from "zod";
import { requireUser } from "@/lib/auth";
import { fail, ok, parseJson, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { waterSettingsSchema } from "@/lib/validation";

export async function GET() {
  const user = await requireUser();
  const settings = await prisma.waterSetting.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id }
  });
  return ok({ settings });
}

export async function PUT(request: Request) {
  const user = await requireUser();
  try {
    const input = await parseJson(request, waterSettingsSchema);
    const settings = await prisma.waterSetting.upsert({
      where: { userId: user.id },
      update: input,
      create: { userId: user.id, ...input }
    });
    return ok({ settings });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    return fail("SERVER_ERROR", "A network error occurred.", 500);
  }
}
