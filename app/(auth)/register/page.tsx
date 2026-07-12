import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand";
import { GlassCard } from "@/components/glass";

export default function RegisterPage() {
  return (
    <GlassCard className="max-h-[calc(100dvh-1rem)] overflow-y-auto p-2.5 sm:p-4">
      <div className="mb-2 sm:mb-3">
        <BrandMark />
        <h1 className="mt-2 font-heading text-xl font-black text-track-ocean sm:mt-3 sm:text-2xl">Create Account</h1>
      </div>
      <AuthForm mode="register" />
    </GlassCard>
  );
}
