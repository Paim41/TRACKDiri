import { BrandMark } from "@/components/brand";
import { GlassCard } from "@/components/glass";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="grid min-h-screen p-4 lg:grid-cols-[.95fr_1fr] lg:p-8">
      <section className="relative hidden overflow-hidden rounded-xl bg-[url('/assets/trackdiri-background.png')] bg-cover bg-center p-8 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-white/55 via-sky-100/38 to-sky-500/20" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <BrandMark />
          <GlassCard className="max-w-md">
            <h1 className="font-heading text-4xl font-black text-track-ocean">Welcome to TRACKDiri</h1>
            <p className="mt-3 font-semibold leading-7 text-slate-700">
              Record hydration, sleep, meals, mood and movement with private server-side health records.
            </p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-3 rounded-full bg-track-aqua-soft">
                  <div className={index < 3 ? "h-full rounded-full bg-track-sky" : ""} />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
