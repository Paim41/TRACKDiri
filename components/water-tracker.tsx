"use client";

import { useMemo, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { WaterGlassIcon } from "@/components/icons";
import { calculateWaterProgress } from "@/lib/water";

type Entry = { id: string; amountMl: number; consumedAt: string; deletedAt?: string | null };
type Settings = {
  dailyGlassTarget: number;
  glassSizeMl: number;
  dailyTargetMl: number;
  reminderStartTime: string;
  reminderEndTime: string;
  reminderInterval: number;
};

export function WaterTracker({ initialEntries, settings, timezone }: { initialEntries: Entry[]; settings: Settings; timezone: string }) {
  const [entries, setEntries] = useState(initialEntries);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progress = useMemo(
    () => calculateWaterProgress(entries.map((entry) => ({ ...entry, consumedAt: new Date(entry.consumedAt), deletedAt: entry.deletedAt ? new Date(entry.deletedAt) : null })), settings),
    [entries, settings]
  );

  async function recordGlass(index: number) {
    if (saving || index < progress.completedGlasses) return;
    if (!window.confirm(`Confirm you finished ${settings.glassSizeMl} ml of water?`)) return;
    setSaving(true);
    setError(null);
    const clientMutationId = crypto.randomUUID();
    const response = await fetch("/api/water/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountMl: settings.glassSizeMl,
        consumedAt: new Date().toISOString(),
        timezone,
        clientMutationId
      })
    });
    const payload = await response.json();
    setSaving(false);
    if (!payload.success) {
      setError(payload.error.message);
      return;
    }
    setEntries((current) => [...current, payload.data.entry]);
  }

  async function undoLast() {
    const last = [...entries].reverse().find((entry) => !entry.deletedAt);
    if (!last || saving) return;
    setSaving(true);
    const response = await fetch(`/api/water/entries/${last.id}`, { method: "DELETE" });
    const payload = await response.json();
    setSaving(false);
    if (!payload.success) {
      setError(payload.error.message);
      return;
    }
    setEntries((current) => current.map((entry) => (entry.id === last.id ? { ...entry, deletedAt: new Date().toISOString() } : entry)));
  }

  return (
    <div className="track-glass-card rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-black text-track-ocean">Eight-Glass Water Tracker</h2>
          <p className="mt-1 text-sm font-bold text-slate-600">
            {progress.completedGlasses} of {settings.dailyGlassTarget} glasses completed, {progress.totalMl} ml of {settings.dailyTargetMl} ml
          </p>
        </div>
        <div className="rounded-full border border-track-border-strong bg-white/80 px-4 py-2 text-sm font-black text-track-ocean">
          {progress.percentage}%
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {Array.from({ length: settings.dailyGlassTarget }).map((_, index) => {
          const complete = index < progress.completedGlasses;
          return (
            <button
              key={index}
              type="button"
              disabled={saving || complete}
              onClick={() => recordGlass(index)}
              className={`interactive-card min-h-28 rounded-xl border bg-white/75 p-3 ${
                complete
                  ? "border-track-sky shadow-[0_0_26px_rgba(10,150,240,.34)]"
                  : "border-track-border-light"
              }`}
              aria-label={complete ? `Glass ${index + 1} completed` : `Record glass ${index + 1}`}
            >
              <WaterGlassIcon filled={complete} checked={complete} />
              <span className="sr-only">{complete ? "Completed" : "Empty"}</span>
            </button>
          );
        })}
      </div>

      {error ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-track-error">{error}</p> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button className="track-button-primary flex items-center gap-2 px-5" onClick={() => recordGlass(progress.completedGlasses)} disabled={saving || progress.goalMet}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : null}
          Quick Add Water
        </button>
        <button className="track-button-secondary flex items-center gap-2 px-5" onClick={undoLast} disabled={saving || progress.completedGlasses === 0}>
          <RotateCcw size={18} />
          Undo Last Glass
        </button>
      </div>
    </div>
  );
}
