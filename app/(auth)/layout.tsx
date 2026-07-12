import { BrandMark } from "@/components/brand";
import { AuthCharacter } from "@/components/auth-character";
import { GlassCard } from "@/components/glass";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="grid h-[100dvh] overflow-hidden p-3 lg:grid-cols-[.9fr_1fr] lg:p-5">
      <section className="relative hidden min-h-0 overflow-hidden rounded-xl bg-[url('/assets/trackdiri-background.png')] bg-cover bg-center p-6 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-white/55 via-sky-100/38 to-sky-500/20" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-4">
          <BrandMark />
          <AuthCharacter />
          <GlassCard className="max-w-md p-4">
            <h1 className="font-heading text-3xl font-black text-track-ocean">Welcome to TRACKDiri</h1>
            <p className="mt-2 font-semibold leading-6 text-slate-700">
              Record hydration, sleep, meals, mood and movement with private server-side health records.
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-3 rounded-full bg-track-aqua-soft">
                  <div className={index < 3 ? "h-full rounded-full bg-track-sky" : ""} />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>
      <section className="flex min-h-0 items-center justify-center overflow-hidden">
        <div className="w-full max-w-md lg:max-w-lg">{children}</div>
      </section>
    </main>
  );
}
