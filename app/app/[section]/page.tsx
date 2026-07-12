import { notFound } from "next/navigation";
import { Activity, CalendarDays, CheckSquare, Dumbbell, HeartPulse, Moon, Pill, Settings, User, Utensils } from "lucide-react";
import { GlassCard } from "@/components/glass";
import { requireAdministrator, requireUser } from "@/lib/auth";

const pages: Record<string, { title: string; description: string; icon: React.ElementType; admin?: boolean }> = {
  today: { title: "Today", description: "Complete checklist items and review today's recorded wellness records.", icon: CheckSquare },
  meals: { title: "Meals", description: "Record breakfast, lunch, dinner, snacks and nutrition notes with server-side storage.", icon: Utensils },
  exercise: { title: "Exercise", description: "Track activity type, duration, distance, intensity and notes.", icon: Dumbbell },
  steps: { title: "Steps and Movement", description: "Record manual step entries and prepare for future device integrations.", icon: Activity },
  sleep: { title: "Sleep", description: "Record bedtime, wake time, duration, quality and general schedule notes.", icon: Moon },
  mood: { title: "Mood and Wellness", description: "Record private mood, stress, energy, anxiety and journal notes.", icon: HeartPulse },
  medication: { title: "Medication", description: "Track schedules and confirmations without dosage recommendations.", icon: Pill },
  measurements: { title: "Measurements", description: "Store optional measurement records and chart them by type.", icon: Activity },
  symptoms: { title: "Symptoms", description: "Keep a private symptom journal with severity and emergency guidance.", icon: HeartPulse },
  calendar: { title: "Calendar", description: "Review daily, weekly and monthly wellness history from real database records.", icon: CalendarDays },
  history: { title: "History", description: "Search and export your wellness records by date and category.", icon: CalendarDays },
  insights: { title: "Insights", description: "View trends, streaks and supportive summaries from your records.", icon: Activity },
  reminders: { title: "Reminders", description: "Configure hydration reminders, quiet hours, snooze and push setup.", icon: Settings },
  notifications: { title: "Notifications", description: "Manage web push subscriptions and delivery state.", icon: Settings },
  profile: { title: "Profile", description: "Manage display name, timezone and personal health preferences.", icon: User },
  settings: { title: "Account Settings", description: "Change password, manage sessions, export data or delete your account.", icon: Settings },
  admin: { title: "Admin Overview", description: "Administrative tools for users, delivery logs, security events and app health.", icon: Settings, admin: true }
};

export default async function GenericProtectedPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const page = pages[section];
  if (!page) notFound();
  if (page.admin) {
    await requireAdministrator();
  } else {
    await requireUser();
  }
  const Icon = page.icon;
  return (
    <main id="main-content" className="mx-auto max-w-5xl p-4 lg:p-8">
      <GlassCard>
        <Icon className="text-track-ocean" size={34} />
        <h1 className="mt-4 font-heading text-3xl font-black text-track-ocean">{page.title}</h1>
        <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-700">{page.description}</p>
        <div className="mt-6 rounded-xl border border-track-border-light bg-white/70 p-4 text-sm font-semibold text-slate-700">
          This section is connected to protected server-side ownership checks and is ready for category-specific forms, history tables and charts.
        </div>
      </GlassCard>
    </main>
  );
}
