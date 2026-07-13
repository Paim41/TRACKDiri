import { notFound } from "next/navigation";
import { Activity, CalendarDays, CheckSquare, Construction, Dumbbell, HeartPulse, Moon, Pill, Settings, User, Utensils } from "lucide-react";
import { GlassCard } from "@/components/glass";
import { AccountWorkspace } from "@/components/account-workspace";
import { SectionWorkspace } from "@/components/section-workspace";
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

const maintenanceSections = new Set(["meals", "exercise", "sleep", "mood", "medication", "calendar", "insights", "reminders"]);

export default async function GenericProtectedPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const page = pages[section];
  if (!page) notFound();
  const user = page.admin ? await requireAdministrator() : await requireUser();
  const Icon = page.icon;
  const account = {
    name: user.name,
    email: user.email,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    preference: {
      timezone: user.preference?.timezone ?? "UTC",
      measurementSystem: user.preference?.measurementSystem ?? "METRIC",
      theme: user.preference?.theme ?? "SYSTEM",
      reducedMotion: user.preference?.reducedMotion ?? false,
      notificationEnabled: user.preference?.notificationEnabled ?? false,
      quietHoursStart: user.preference?.quietHoursStart ?? "22:00",
      quietHoursEnd: user.preference?.quietHoursEnd ?? "08:00"
    }
  };

  return (
    <main id="main-content" className="mx-auto max-w-5xl space-y-5 p-4 lg:p-8">
      <GlassCard>
        <Icon className="text-track-ocean" size={34} />
        <h1 className="mt-4 font-heading text-3xl font-black text-track-ocean">{page.title}</h1>
        <p className="mt-3 max-w-2xl font-semibold leading-7 text-slate-700">{page.description}</p>
        {maintenanceSections.has(section) ? (
          <MaintenancePanel />
        ) : section === "profile" || section === "settings" ? (
          <AccountWorkspace section={section} account={account} />
        ) : (
          <SectionWorkspace section={section} />
        )}
      </GlassCard>
    </main>
  );
}

function MaintenancePanel() {
  return (
    <div className="mt-6 rounded-lg border border-sky-200 bg-white/78 p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-track-ocean text-white shadow-[0_14px_32px_rgba(6,58,120,.18)]">
          <Construction size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black uppercase tracking-wide text-track-sky">Temporarily closed</p>
          <h2 className="mt-1 font-heading text-2xl font-black text-track-ocean">This tracker is under maintenance.</h2>
          <p className="mt-2 max-w-2xl font-semibold leading-7 text-slate-700">
            We are polishing this page before opening it again. Dashboard, Today, Water, Profile and Settings remain available.
          </p>
        </div>
      </div>
    </div>
  );
}
