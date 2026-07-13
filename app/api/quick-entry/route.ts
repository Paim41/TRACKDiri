import { fail, ok, parseJson } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const quickEntrySchema = z.object({
  section: z.string(),
  values: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
});

function text(values: Record<string, string | number | boolean>, key: string, fallback = "") {
  const value = values[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(values: Record<string, string | number | boolean>, key: string, fallback: number) {
  const value = values[key];
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  const user = await requireUser();
  const input = await parseJson(request, quickEntrySchema);
  const now = new Date();

  switch (input.section) {
    case "today": {
      const title = text(input.values, "title");
      if (!title) return fail("MISSING_TITLE", "Add a checklist title.", 422);
      const item = await prisma.checklistTemplate.create({
        data: { userId: user.id, title, recurrence: "DAILY" }
      });
      return ok({ id: item.id, label: item.title });
    }
    case "meals": {
      const title = text(input.values, "title");
      if (!title) return fail("MISSING_MEAL", "Add a meal name.", 422);
      const meal = await prisma.mealEntry.create({
        data: {
          userId: user.id,
          title,
          mealType: text(input.values, "mealType", "MEAL"),
          consumedAt: now
        }
      });
      return ok({ id: meal.id, label: meal.title });
    }
    case "exercise": {
      const activityType = text(input.values, "activityType");
      if (!activityType) return fail("MISSING_ACTIVITY", "Add an activity.", 422);
      const exercise = await prisma.exerciseEntry.create({
        data: {
          userId: user.id,
          activityType,
          durationMinutes: Math.max(1, Math.round(numberValue(input.values, "durationMinutes", 20))),
          startedAt: now
        }
      });
      return ok({ id: exercise.id, label: exercise.activityType });
    }
    case "sleep": {
      const durationMinutes = Math.max(15, Math.round(numberValue(input.values, "durationHours", 8) * 60));
      const sleep = await prisma.sleepEntry.create({
        data: {
          userId: user.id,
          bedtime: new Date(now.getTime() - durationMinutes * 60 * 1000),
          wakeTime: now,
          durationMinutes,
          quality: Math.max(1, Math.min(5, Math.round(numberValue(input.values, "quality", 3))))
        }
      });
      return ok({ id: sleep.id, label: `${Math.round(durationMinutes / 60)}h sleep` });
    }
    case "mood": {
      const moodText = text(input.values, "mood");
      if (!moodText) return fail("MISSING_MOOD", "Choose or type a mood.", 422);
      const mood = await prisma.moodEntry.create({
        data: {
          userId: user.id,
          mood: moodText,
          intensity: Math.max(1, Math.min(10, Math.round(numberValue(input.values, "intensity", 5)))),
          recordedAt: now
        }
      });
      return ok({ id: mood.id, label: mood.mood });
    }
    case "medication": {
      const name = text(input.values, "name");
      if (!name) return fail("MISSING_MEDICATION", "Add a medication name.", 422);
      const medication = await prisma.medication.create({
        data: {
          userId: user.id,
          name,
          dosageText: text(input.values, "dosageText", "As directed"),
          schedule: text(input.values, "schedule", "Daily"),
          startDate: now
        }
      });
      return ok({ id: medication.id, label: medication.name });
    }
    case "reminders": {
      const category = text(input.values, "category", "general");
      const reminder = await prisma.reminder.create({
        data: {
          userId: user.id,
          category,
          scheduledAt: new Date(now.getTime() + Math.max(15, numberValue(input.values, "minutesFromNow", 60)) * 60 * 1000),
          payload: { note: text(input.values, "note", "TRACKDiri reminder") }
        }
      });
      return ok({ id: reminder.id, label: reminder.category });
    }
    default:
      return fail("UNSUPPORTED_SECTION", "This page does not support quick entry yet.", 422);
  }
}
