import { AuthForm } from "@/components/auth-form";
import { GlassCard } from "@/components/glass";

export default function ForgotPasswordPage() {
  return (
    <GlassCard className="max-h-[calc(100dvh-1rem)] p-4 sm:p-5">
      <h1 className="font-heading text-3xl font-black text-track-ocean">Reset Password</h1>
      <p className="mt-2 text-sm font-semibold text-slate-600">Enter your email and TRACKDiri will send a time-limited reset link if an account exists.</p>
      <div className="mt-4">
        <AuthForm mode="forgot" />
      </div>
    </GlassCard>
  );
}
