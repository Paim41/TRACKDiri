import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { endOfDay, startOfDay } from "date-fns";

export type WaterSettings = {
  dailyGlassTarget: number;
  glassSizeMl: number;
  dailyTargetMl: number;
  reminderStartTime: string;
  reminderEndTime: string;
  reminderInterval: number;
};

export type WaterEntryLike = {
  amountMl: number;
  consumedAt: Date;
  deletedAt?: Date | null;
};

export function getZonedDayRange(date: Date, timezone: string) {
  const zoned = toZonedTime(date, timezone);
  return {
    start: fromZonedTime(startOfDay(zoned), timezone),
    end: fromZonedTime(endOfDay(zoned), timezone)
  };
}

export function calculateWaterProgress(entries: WaterEntryLike[], settings: WaterSettings) {
  const active = entries.filter((entry) => !entry.deletedAt);
  const totalMl = active.reduce((sum, entry) => sum + entry.amountMl, 0);
  const completedGlasses = Math.min(settings.dailyGlassTarget, Math.floor(totalMl / settings.glassSizeMl));
  const remainingMl = Math.max(0, settings.dailyTargetMl - totalMl);
  return {
    totalMl,
    completedGlasses,
    remainingGlasses: Math.max(0, settings.dailyGlassTarget - completedGlasses),
    percentage: Math.min(100, Math.round((totalMl / settings.dailyTargetMl) * 100)),
    remainingMl,
    goalMet: totalMl >= settings.dailyTargetMl
  };
}

export function calculateHealthScore(input: {
  waterPercent: number;
  sleepMinutes?: number;
  exerciseMinutes?: number;
  meals: number;
  moodIntensity?: number;
  checklistPercent: number;
}) {
  const water = Math.min(20, input.waterPercent * 0.2);
  const sleep = input.sleepMinutes ? Math.min(20, (input.sleepMinutes / 480) * 20) : 0;
  const exercise = input.exerciseMinutes ? Math.min(20, (input.exerciseMinutes / 30) * 20) : 0;
  const nutrition = Math.min(20, (input.meals / 3) * 20);
  const mood = input.moodIntensity ? Math.min(10, (input.moodIntensity / 5) * 10) : 0;
  const checklist = Math.min(10, input.checklistPercent * 0.1);
  return Math.round(water + sleep + exercise + nutrition + mood + checklist);
}

export function nextReminderTime(now: Date, settings: WaterSettings) {
  const [hours, minutes] = settings.reminderEndTime.split(":").map(Number);
  const next = new Date(now);
  next.setMinutes(now.getMinutes() + settings.reminderInterval);
  const end = new Date(now);
  end.setHours(hours, minutes, 0, 0);
  return next > end ? null : next;
}
