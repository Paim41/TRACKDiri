import Link from "next/link";
import Image from "next/image";
import { Activity, Bell, CalendarDays, Cloud, Droplets, Lock, Smartphone, Wifi } from "lucide-react";
import { BrandMark, TrackLogo } from "@/components/brand";
import { GlassCard } from "@/components/glass";
import { WaterGlassIcon } from "@/components/icons";

const features = [
  { title: "Eight-glass water tracker", icon: Droplets, text: "Tap each glass only after you finish it. Every record is saved with time and timezone." },
  { title: "Daily health dashboard", icon: Activity, text: "Water, sleep, meals, movement, mood and medication status in one private view." },
  { title: "Android and iOS reminders", icon: Bell, text: "Server-side reminder scheduling with web push support where the platform allows it." },
  { title: "Offline PWA", icon: Cloud, text: "Installable app shell, offline page and queued health mutations for reconnection." },
  { title: "Real-time sync", icon: Wifi, text: "Database records update the dashboard through a replaceable real-time provider abstraction." },
  { title: "Private by design", icon: Lock, text: "HTTP-only sessions, Argon2id passwords, token hashing and ownership checks." }
];

const faqs = [
  ["Does TRACKDiri record water automatically?", "No. A glass is counted only after intentional confirmation."],
  ["Can I use it as a mobile app?", "Yes. TRACKDiri ships as an installable PWA with Android and iOS guidance."],
  ["Is it medical advice?", "No. It is a wellness tracker and history tool, not a diagnostic or emergency service."]
];

export default function LandingPage() {
  return (
    <main id="main-content" className="min-h-screen px-4 py-4 text-track-navy sm:px-6 lg:px-8">
      <header className="track-glass-card mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3">
        <BrandMark />
        <nav className="hidden items-center gap-6 text-sm font-bold text-track-ocean md:flex">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:items-center">
          <Link href="/app/dashboard" className="track-button-secondary px-3 py-2 text-center text-xs sm:px-4 sm:text-sm">Open App</Link>
          <Link href="/login" className="track-button-secondary px-3 py-2 text-center text-xs sm:px-4 sm:text-sm">Login</Link>
          <Link href="/register" className="track-button-primary px-3 py-2 text-center text-xs sm:px-4 sm:text-sm">Create Account</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 py-12 lg:grid-cols-[1fr_.86fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-track-border-strong bg-white/70 px-4 py-2 text-sm font-black text-track-ocean">
            Real-time daily wellness tracker
          </p>
          <h1 className="font-heading text-4xl font-black leading-tight text-track-ocean sm:text-6xl">
            Take Control of Your Daily Health
          </h1>
          <p className="max-w-2xl text-lg font-semibold leading-8 text-slate-700">
            TRACKDiri helps you record water, sleep, movement, meals, mood and daily wellness habits in one private real-time application.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/app/dashboard" className="track-button-secondary px-6 py-3">Open Dashboard</Link>
            <Link href="/register" className="track-button-primary px-6 py-3">Create Account</Link>
            <Link href="/login" className="track-button-secondary px-6 py-3">Login</Link>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-bold text-track-ocean">
            <span className="rounded-full bg-white/70 px-4 py-2">PWA ready</span>
            <span className="rounded-full bg-white/70 px-4 py-2">PostgreSQL records</span>
            <span className="rounded-full bg-white/70 px-4 py-2">Google authentication</span>
          </div>
        </div>

        <GlassCard className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />
          <div className="relative mx-auto grid max-w-md gap-5 text-center">
            <TrackLogo size={170} />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-20 rounded-xl border border-track-border-light bg-white/70 p-2">
                  <WaterGlassIcon filled={index < 5} checked={index < 5} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xl bg-white/76 p-4">
                <p className="text-sm font-bold text-slate-600">Daily score</p>
                <p className="text-3xl font-black text-track-ocean">78</p>
              </div>
              <div className="rounded-xl bg-white/76 p-4">
                <p className="text-sm font-bold text-slate-600">Next reminder</p>
                <p className="text-2xl font-black text-track-red">2:00 PM</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-4 py-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <GlassCard key={feature.title} className="interactive-card">
            <feature.icon className="mb-4 text-track-ocean" size={28} />
            <h2 className="font-heading text-xl font-black text-track-ocean">{feature.title}</h2>
            <p className="mt-2 font-semibold leading-7 text-slate-700">{feature.text}</p>
          </GlassCard>
        ))}
      </section>

      <section id="how" className="mx-auto grid max-w-7xl gap-5 py-8 lg:grid-cols-3">
        {["Record habits intentionally", "Sync across devices", "Review history and insights"].map((step, index) => (
          <GlassCard key={step}>
            <p className="text-sm font-black text-track-red">Step {index + 1}</p>
            <h2 className="mt-2 font-heading text-2xl font-black text-track-ocean">{step}</h2>
          </GlassCard>
        ))}
      </section>

      <section className="mx-auto max-w-7xl py-8">
        <GlassCard>
          <div className="grid gap-6 lg:grid-cols-[.7fr_1fr] lg:items-center">
            <Image src="/assets/trackdiri-navigation.png" alt="TRACKDiri navigation character" width={360} height={640} className="mx-auto max-h-[460px] w-auto rounded-xl object-cover object-bottom" />
            <div>
              <h2 className="font-heading text-3xl font-black text-track-ocean">Built for phone, tablet and desktop</h2>
              <p className="mt-3 font-semibold leading-8 text-slate-700">
                The same real records power the mobile bottom navigation, desktop sidebar, reminder settings, calendar and health history.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 font-bold text-track-ocean"><Smartphone size={18} /> Installable PWA</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 font-bold text-track-ocean"><CalendarDays size={18} /> Daily history</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 py-8 md:grid-cols-3">
        {faqs.map(([question, answer]) => (
          <GlassCard key={question}>
            <h2 className="font-heading text-xl font-black text-track-ocean">{question}</h2>
            <p className="mt-2 font-semibold leading-7 text-slate-700">{answer}</p>
          </GlassCard>
        ))}
      </section>

      <footer className="mx-auto max-w-7xl py-10 text-sm font-semibold text-track-ocean">
        <div className="track-glass-card flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-4">
          <BrandMark />
          <div className="flex gap-4">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/health-disclaimer">Health Disclaimer</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
