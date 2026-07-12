"use client";

import { GlassCard } from "@/components/glass";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="grid min-h-screen place-items-center p-4">
      <GlassCard className="max-w-md text-center">
        <h1 className="font-heading text-3xl font-black text-track-ocean">Server Error</h1>
        <p className="mt-3 font-semibold text-slate-700">TRACKDiri could not finish this request.</p>
        <button onClick={reset} className="track-button-primary mt-6 px-5 py-3">Retry</button>
      </GlassCard>
    </main>
  );
}
