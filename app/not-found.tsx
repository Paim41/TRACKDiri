import Link from "next/link";
import { GlassCard } from "@/components/glass";

export default function NotFoundPage() {
  return (
    <main id="main-content" className="grid min-h-screen place-items-center p-4">
      <GlassCard className="max-w-md text-center">
        <h1 className="font-heading text-3xl font-black text-track-ocean">Page Not Found</h1>
        <p className="mt-3 font-semibold text-slate-700">The page you requested is not available in TRACKDiri.</p>
        <Link href="/" className="track-button-primary mt-6 inline-flex px-5 py-3">Go Home</Link>
      </GlassCard>
    </main>
  );
}
