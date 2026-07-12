import { requireUser } from "@/lib/auth";
import { ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { calculateHealthScore, calculateWaterProgress, getZonedDayRange } from "@/lib/water";

export async function GET() {
  const user = await requireUser();
  const timezone = user.preference?.timezone ?? "UTC";
  const settings = user.waterSetting ?? (await prisma.waterSetting.create({ data: { userId: user.id } }));
  const range = getZonedDayRange(new Date(), timezone);
  const [waterEntries, meals, exercise, sleep, mood] = await Promise.all([
    prisma.waterEntry.findMany({ where: { userId: user.id, consumedAt: { gte: range.start, lte: range.end } } }),
    prisma.mealEntry.count({ where: { userId: user.id, consumedAt: { gte: range.start, lte: range.end } } }),
    prisma.exerciseEntry.aggregate({ where: { userId: user.id, startedAt: { gte: range.start, lte: range.end } }, _sum: { durationMinutes: true } }),
    prisma.sleepEntry.findFirst({ where: { userId: user.id, wakeTime: { gte: range.start, lte: range.end } } }),
    prisma.moodEntry.findFirst({ where: { userId: user.id, recordedAt: { gte: range.start, lte: range.end } } })
  ]);
  const water = calculateWaterProgress(waterEntries, settings);
  return ok({
    water,
    score: calculateHealthScore({
      waterPercent: water.percentage,
      sleepMinutes: sleep?.durationMinutes,
      exerciseMinutes: exercise._sum.durationMinutes ?? 0,
      meals,
      moodIntensity: mood?.intensity,
      checklistPercent: 0
    })
  });
}
