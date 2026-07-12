import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import { GlassCard } from "@/components/glass";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  let verified = false;

  if (token) {
    const record = await prisma.verificationToken.findUnique({ where: { tokenHash: hashToken(token) } });
    if (record && !record.usedAt && record.expiresAt > new Date()) {
      await prisma.$transaction([
        prisma.verificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
        prisma.user.update({
          where: { id: record.userId },
          data: { emailVerifiedAt: new Date(), status: "ACTIVE" }
        })
      ]);
      verified = true;
    }
  }

  return (
    <main id="main-content" className="grid min-h-screen place-items-center p-4">
      <GlassCard className="max-w-md text-center">
        <h1 className="font-heading text-3xl font-black text-track-ocean">
          {verified ? "Verification Successful" : "Verification Expired"}
        </h1>
        <p className="mt-3 font-semibold leading-7 text-slate-700">
          {verified ? "Your TRACKDiri account is active. You can now login." : "Your verification link is invalid or expired."}
        </p>
        <Link href="/login" className="track-button-primary mt-6 inline-flex px-5 py-3">Continue</Link>
      </GlassCard>
    </main>
  );
}
