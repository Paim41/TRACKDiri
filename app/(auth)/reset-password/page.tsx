import { AuthForm } from "@/components/auth-form";
import { GlassCard } from "@/components/glass";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <GlassCard className="max-h-[calc(100dvh-1.5rem)] p-4 sm:p-5">
      <h1 className="font-heading text-3xl font-black text-track-ocean">Set New Password</h1>
      <div className="mt-4">
        <AuthForm mode="reset" token={token} />
      </div>
    </GlassCard>
  );
}
