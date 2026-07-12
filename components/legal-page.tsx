import Link from "next/link";
import { BrandMark } from "@/components/brand";
import { GlassCard } from "@/components/glass";

export function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <main id="main-content" className="mx-auto grid min-h-screen max-w-3xl place-items-center p-4">
      <GlassCard>
        <BrandMark />
        <h1 className="mt-6 font-heading text-3xl font-black text-track-ocean">{title}</h1>
        <p className="mt-4 font-semibold leading-8 text-slate-700">{body}</p>
        <Link href="/" className="track-button-secondary mt-6 inline-flex px-5 py-3">Back to Home</Link>
      </GlassCard>
    </main>
  );
}
