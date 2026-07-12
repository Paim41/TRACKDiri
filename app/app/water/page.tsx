import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getZonedDayRange } from "@/lib/water";
import { WaterTracker } from "@/components/water-tracker";

export default async function WaterPage() {
  const user = await requireUser();
  const timezone = user.preference?.timezone ?? "UTC";
  const settings = user.waterSetting ?? (await prisma.waterSetting.create({ data: { userId: user.id } }));
  const range = getZonedDayRange(new Date(), timezone);
  const entries = await prisma.waterEntry.findMany({
    where: { userId: user.id, consumedAt: { gte: range.start, lte: range.end } },
    orderBy: { consumedAt: "asc" }
  });

  return (
    <main id="main-content" className="mx-auto max-w-5xl space-y-5 p-4 lg:p-8">
      <WaterTracker
        initialEntries={entries.map((entry) => ({
          id: entry.id,
          amountMl: entry.amountMl,
          consumedAt: entry.consumedAt.toISOString(),
          deletedAt: entry.deletedAt?.toISOString() ?? null
        }))}
        settings={settings}
        timezone={timezone}
      />
    </main>
  );
}
