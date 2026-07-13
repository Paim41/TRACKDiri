import { format } from "date-fns";
import { Activity, Bell, CheckSquare, Moon, Utensils } from "lucide-react";
import { GlassCard } from "@/components/glass";
import { TrackLogo } from "@/components/brand";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateHealthScore, calculateWaterProgress, getZonedDayRange, nextReminderTime } from "@/lib/water";
import { WaterTracker } from "@/components/water-tracker";

export default async function DashboardPage() {
  const user = await requireUser();
  const timezone = user.preference?.timezone ?? "UTC";
  const settings =
    user.waterSetting ??
    (await prisma.waterSetting.create({
      data: { userId: user.id }
    }));
  const range = getZonedDayRange(new Date(), timezone);
  const [waterEntries, meals, exercise, sleep, mood, checklistTemplates, checklistCompletions] = await prisma.$transaction([
    prisma.waterEntry.findMany({ where: { userId: user.id, consumedAt: { gte: range.start, lte: range.end } }, orderBy: { consumedAt: "asc" } }),
    prisma.mealEntry.count({ where: { userId: user.id, consumedAt: { gte: range.start, lte: range.end } } }),
    prisma.exerciseEntry.aggregate({ where: { userId: user.id, startedAt: { gte: range.start, lte: range.end } }, _sum: { durationMinutes: true } }),
    prisma.sleepEntry.findFirst({ where: { userId: user.id, wakeTime: { gte: range.start, lte: range.end } }, orderBy: { wakeTime: "desc" } }),
    prisma.moodEntry.findFirst({ where: { userId: user.id, recordedAt: { gte: range.start, lte: range.end } }, orderBy: { recordedAt: "desc" } }),
    prisma.checklistTemplate.count({ where: { userId: user.id, active: true } }),
    prisma.checklistCompletion.count({ where: { userId: user.id, completedAt: { gte: range.start, lte: range.end } } })
  ]);
  const progress = calculateWaterProgress(waterEntries, settings);
  const checklistPercent = checklistTemplates ? (checklistCompletions / checklistTemplates) * 100 : 0;
  const score = calculateHealthScore({
    waterPercent: progress.percentage,
    sleepMinutes: sleep?.durationMinutes,
    exerciseMinutes: exercise._sum.durationMinutes ?? 0,
    meals,
    moodIntensity: mood?.intensity,
    checklistPercent
  });
  const nextReminder = progress.goalMet ? null : nextReminderTime(new Date(), settings);

  return (
    <main id="main-content" className="mx-auto max-w-7xl space-y-5 p-4 lg:p-8">
      <section className="rounded-xl bg-gradient-to-br from-[rgba(7,89,168,.88)] to-[rgba(10,150,240,.58)] p-5 text-white shadow-track">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-bold text-white/80">{format(new Date(), "EEEE, MMMM d")}</p>
            <h1 className="mt-2 font-heading text-4xl font-black">Hello, {user.name}</h1>
            <p className="mt-2 max-w-2xl font-semibold leading-7 text-white/88">
              Today&apos;s wellness score is based on water, sleep, exercise, meals, mood and checklist records. It is general wellness guidance, not a diagnosis.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <TrackLogo size={96} />
            <div className="text-center">
              <p className="text-sm font-bold text-white/80">Health score</p>
              <p className="text-5xl font-black">{score}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} label="Water" value={`${progress.totalMl} ml`} helper={`${progress.remainingMl} ml remaining`} />
        <StatCard icon={Utensils} label="Meals" value={meals ? String(meals) : "No records"} helper="Meals completed today" />
        <StatCard icon={Moon} label="Sleep" value={sleep ? `${Math.round(sleep.durationMinutes / 60)} h` : "No record"} helper="Last sleep entry" />
        <StatCard icon={CheckSquare} label="Checklist" value={`${Math.round(checklistPercent)}%`} helper={`${checklistCompletions} completed`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <WaterTracker
          initialEntries={waterEntries.map((entry) => ({
            id: entry.id,
            amountMl: entry.amountMl,
            consumedAt: entry.consumedAt.toISOString(),
            deletedAt: entry.deletedAt?.toISOString() ?? null
          }))}
          settings={settings}
          timezone={timezone}
        />
        <GlassCard>
          <Bell className="text-track-ocean" size={28} />
          <h2 className="mt-3 font-heading text-2xl font-black text-track-ocean">Next recommended action</h2>
          <p className="mt-2 font-semibold leading-7 text-slate-700">
            {progress.goalMet
              ? "Water goal complete for today. Reminders stop after goal completion."
              : nextReminder
                ? `Drink your next glass around ${format(nextReminder, "p")} and confirm it in TRACKDiri.`
                : "No more water reminders are scheduled inside today's configured window."}
          </p>
        </GlassCard>
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, label, value, helper }: { icon: React.ElementType; label: string; value: string; helper: string }) {
  return (
    <GlassCard className="interactive-card">
      <Icon className="text-track-ocean" size={24} />
      <p className="mt-4 text-sm font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black text-track-navy">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">{helper}</p>
    </GlassCard>
  );
}
