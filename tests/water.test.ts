import { describe, expect, it } from "vitest";
import { calculateHealthScore, calculateWaterProgress, getZonedDayRange, nextReminderTime } from "@/lib/water";

const settings = {
  dailyGlassTarget: 8,
  glassSizeMl: 250,
  dailyTargetMl: 2000,
  reminderStartTime: "08:00",
  reminderEndTime: "22:00",
  reminderInterval: 120
};

describe("water progress", () => {
  it("calculates eight-glass progress from real entries", () => {
    const progress = calculateWaterProgress(
      [
        { amountMl: 250, consumedAt: new Date("2026-07-12T08:00:00Z") },
        { amountMl: 250, consumedAt: new Date("2026-07-12T10:00:00Z") },
        { amountMl: 250, consumedAt: new Date("2026-07-12T12:00:00Z") }
      ],
      settings
    );
    expect(progress.completedGlasses).toBe(3);
    expect(progress.totalMl).toBe(750);
    expect(progress.remainingGlasses).toBe(5);
    expect(progress.percentage).toBe(38);
  });

  it("ignores deleted entries", () => {
    const progress = calculateWaterProgress(
      [
        { amountMl: 250, consumedAt: new Date(), deletedAt: null },
        { amountMl: 250, consumedAt: new Date(), deletedAt: new Date() }
      ],
      settings
    );
    expect(progress.totalMl).toBe(250);
  });

  it("uses a timezone day range for midnight reset", () => {
    const range = getZonedDayRange(new Date("2026-07-12T17:00:00.000Z"), "Asia/Kuala_Lumpur");
    expect(range.start.toISOString()).toBe("2026-07-12T16:00:00.000Z");
  });

  it("stops reminders after the configured window", () => {
    const reminder = nextReminderTime(new Date("2026-07-12T21:30:00"), settings);
    expect(reminder).toBeNull();
  });
});

describe("health score", () => {
  it("keeps the score transparent and bounded", () => {
    expect(
      calculateHealthScore({
        waterPercent: 100,
        sleepMinutes: 480,
        exerciseMinutes: 30,
        meals: 3,
        moodIntensity: 5,
        checklistPercent: 100
      })
    ).toBe(100);
  });
});
