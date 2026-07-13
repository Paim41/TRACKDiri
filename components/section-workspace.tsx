"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCw } from "lucide-react";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "select";
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
};

const quickForms: Record<string, { title: string; fields: Field[] }> = {
  today: {
    title: "Add today's checklist item",
    fields: [{ name: "title", label: "Checklist item", placeholder: "Morning walk, vitamins, stretching" }]
  },
  meals: {
    title: "Log a meal",
    fields: [
      { name: "title", label: "Meal", placeholder: "Chicken rice, oatmeal, fruit bowl" },
      { name: "mealType", label: "Type", type: "select", options: ["Breakfast", "Lunch", "Dinner", "Snack"] }
    ]
  },
  exercise: {
    title: "Log exercise",
    fields: [
      { name: "activityType", label: "Activity", placeholder: "Walking, cycling, gym" },
      { name: "durationMinutes", label: "Minutes", type: "number", defaultValue: "20" }
    ]
  },
  sleep: {
    title: "Log last sleep",
    fields: [
      { name: "durationHours", label: "Hours slept", type: "number", defaultValue: "8" },
      { name: "quality", label: "Quality", type: "select", options: ["1", "2", "3", "4", "5"] }
    ]
  },
  mood: {
    title: "Log mood",
    fields: [
      { name: "mood", label: "Mood", type: "select", options: ["Calm", "Happy", "Tired", "Stressed", "Anxious", "Focused"] },
      { name: "intensity", label: "Intensity 1-10", type: "number", defaultValue: "5" }
    ]
  },
  medication: {
    title: "Add medication",
    fields: [
      { name: "name", label: "Name", placeholder: "Medication name" },
      { name: "dosageText", label: "Dosage text", placeholder: "1 tablet" },
      { name: "schedule", label: "Schedule", placeholder: "Daily after breakfast" }
    ]
  },
  reminders: {
    title: "Create reminder",
    fields: [
      { name: "category", label: "Category", type: "select", options: ["water", "meal", "exercise", "medication", "general"] },
      { name: "minutesFromNow", label: "Minutes from now", type: "number", defaultValue: "60" },
      { name: "note", label: "Note", placeholder: "Drink water" }
    ]
  }
};

const utilityActions: Record<string, string[]> = {
  calendar: ["Review today's records from the dashboard", "Use Water to add hydration entries", "Use Meals or Exercise to build history"],
  insights: ["Open Dashboard for your live score", "Add entries for richer trends", "Keep daily records for better summaries"],
  profile: ["Review your account identity", "Keep timezone and measurement preferences current", "Use Settings for account-level actions"],
  settings: ["Manage account security", "Review notification preferences", "Return to Dashboard after changes"],
  steps: ["Record movement through Exercise for now", "Use Dashboard to review active minutes", "Device step sync can be connected later"],
  measurements: ["Track body measurements privately", "Use notes to keep context", "Review trends from Insights"],
  symptoms: ["Write symptom notes privately", "Use emergency services for urgent symptoms", "Review patterns over time"],
  history: ["Use Calendar for date-based review", "Use Dashboard for today's summary", "Add entries from each tracker"],
  notifications: ["Create reminders", "Enable browser notification permissions", "Review push setup"]
};

export function SectionWorkspace({ section }: { section: string }) {
  const config = quickForms[section];
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const actions = useMemo(() => utilityActions[section] ?? ["Open Dashboard", "Add a record", "Review progress"], [section]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!config) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/quick-entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, values })
    });
    const payload = await response.json();
    setLoading(false);
    if (!payload.success) {
      setError(payload.error.message);
      return;
    }
    setMessage(`Saved: ${payload.data.label}`);
    event.currentTarget.reset();
  }

  if (!config) {
    return (
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {actions.map((action) => (
          <div key={action} className="rounded-lg border border-track-border-light bg-white/72 p-4 font-semibold text-slate-700">
            {action}
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-lg border border-track-border-light bg-white/72 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-black text-track-ocean">{config.title}</h2>
        <RefreshCw size={18} className="text-track-ocean" aria-hidden="true" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {config.fields.map((field) => (
          <label key={field.name} className="text-sm font-bold text-track-navy">
            {field.label}
            {field.type === "select" ? (
              <select name={field.name} className="track-input mt-1.5" defaultValue={field.defaultValue ?? field.options?.[0]}>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type={field.type ?? "text"}
                className="track-input mt-1.5"
                placeholder={field.placeholder}
                defaultValue={field.defaultValue}
                min={field.type === "number" ? 1 : undefined}
                required
              />
            )}
          </label>
        ))}
      </div>
      {error ? <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-track-error">{error}</p> : null}
      {message ? <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-track-success">{message}</p> : null}
      <button type="submit" disabled={loading} className="track-button-primary mt-4 inline-flex items-center gap-2 px-4 disabled:opacity-60">
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
        Save Entry
      </button>
    </form>
  );
}
