import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { publishRealtimeEvent } from "@/lib/realtime";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const entry = await prisma.waterEntry.findFirst({ where: { id, userId: user.id } });
  if (!entry) return fail("NOT_FOUND", "Water entry not found.", 404);
  const updated = await prisma.waterEntry.update({ where: { id: entry.id }, data: { deletedAt: new Date() } });
  await publishRealtimeEvent({ type: "water.updated", userId: user.id, day: updated.consumedAt.toISOString().slice(0, 10) });
  return ok({ entry: updated });
}
