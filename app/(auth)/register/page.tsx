import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand";
import { GlassCard } from "@/components/glass";

export default function RegisterPage() {
  return (
    <GlassCard className="max-h-[calc(100dvh-1.5rem)] p-3 sm:p-4">
      <div className="mb-3">
        <BrandMark />
        <h1 className="mt-3 font-heading text-2xl font-black text-track-ocean">Create Account</h1>
      </div>
      <AuthForm mode="register" />
    </GlassCard>
  );
}
