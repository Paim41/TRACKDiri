"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bell, CalendarDays, CheckSquare, Dumbbell, HeartPulse, Home, LogOut, Moon, Pill, Settings, User, Utensils, Waves } from "lucide-react";
import { BrandMark } from "@/components/brand";
import { cn } from "@/lib/cn";

const mainItems = [
  ["/app/dashboard", "Dashboard", Home],
  ["/app/today", "Today", CheckSquare],
  ["/app/water", "Water", Waves],
  ["/app/meals", "Meals", Utensils],
  ["/app/exercise", "Exercise", Dumbbell],
  ["/app/sleep", "Sleep", Moon],
  ["/app/mood", "Mood", HeartPulse],
  ["/app/medication", "Medication", Pill],
  ["/app/calendar", "Calendar", CalendarDays],
  ["/app/insights", "Insights", Activity],
  ["/app/reminders", "Reminders", Bell]
] as const;

const mobileItems = [
  ["/app/dashboard", "Home", Home],
  ["/app/today", "Today", CheckSquare],
  ["/app/water", "Track", Waves],
  ["/app/calendar", "Calendar", CalendarDays],
  ["/app/profile", "Profile", User]
] as const;

const supportItems = [
  ["/app/profile", "Profile", User],
  ["/app/settings", "Settings", Settings]
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pb-24 lg:grid lg:grid-cols-[290px_1fr] lg:pb-0">
      <aside className="navigation-background relative hidden max-h-screen overflow-hidden bg-[url('/assets/trackdiri-navigation.png')] bg-cover [background-position:center_bottom] lg:block">
        <div className="absolute inset-0 bg-gradient-to-b from-[#043069]/90 via-[#05559c]/70 to-[#043069]/10" />
        <div className="relative z-10 flex h-screen flex-col p-5 text-white">
          <BrandMark inverse />
          <nav className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="space-y-2">
              {mainItems.map(([href, label, Icon]) => (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-lg border border-white/12 bg-white/8 px-3 text-sm font-bold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,.14)] backdrop-blur-md transition hover:border-white/30 hover:bg-white/18",
                    isActive(pathname, href) && "border-white/45 bg-white/25 text-white shadow-[0_12px_32px_rgba(6,58,120,.22),inset_0_1px_0_rgba(255,255,255,.35)]"
                  )}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-md bg-white/12 text-white",
                      isActive(pathname, href) && "bg-white text-track-ocean"
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="mt-5 space-y-2">
            {supportItems.map(([href, label, Icon]) => (
              <Link
                key={href}
                href={href}
                prefetch={false}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg border border-white/12 bg-white/8 px-3 text-sm font-bold text-white/90 backdrop-blur-md transition hover:border-white/30 hover:bg-white/18",
                  isActive(pathname, href) && "border-white/45 bg-white/25 text-white"
                )}
                aria-current={isActive(pathname, href) ? "page" : undefined}
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
            <form action="/api/auth/logout" method="post">
              <button className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-white/12 bg-white/8 px-3 text-left text-sm font-bold text-white/90 backdrop-blur-md transition hover:border-white/30 hover:bg-white/18">
                <LogOut size={18} /> Logout
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-track-border-light bg-white/70 px-4 py-3 backdrop-blur-xl lg:hidden">
          <BrandMark />
        </header>
        {children}
      </div>
      <nav className="track-glass-card fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-xl px-2 py-2 lg:hidden">
        {mobileItems.map(([href, label, Icon], index) => (
          <Link
            key={href}
            href={href}
            prefetch={false}
            className={cn(
              "grid min-h-14 place-items-center rounded-lg border border-transparent text-xs font-black text-track-ocean transition",
              index === 2 && "mx-auto -mt-6 h-16 w-16 rounded-full bg-track-sky text-white shadow-[0_0_26px_rgba(10,150,240,.34)]",
              isActive(pathname, href) && index !== 2 && "border-track-border-light bg-white/75 shadow-[0_10px_26px_rgba(6,58,120,.12)]",
              isActive(pathname, href) && index === 2 && "bg-track-ocean shadow-[0_0_30px_rgba(10,150,240,.46)]"
            )}
            aria-current={isActive(pathname, href) ? "page" : undefined}
          >
            <Icon size={index === 2 ? 24 : 20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
