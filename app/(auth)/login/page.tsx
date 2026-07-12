import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand";
import { GlassCard } from "@/components/glass";

export default function LoginPage() {
  return (
    <GlassCard className="max-h-[calc(100dvh-1rem)] p-4 sm:p-5">
      <div className="mb-4">
        <BrandMark />
        <h1 className="mt-4 font-heading text-3xl font-black text-track-ocean">Login</h1>
      </div>
      <AuthForm mode="login" />
    </GlassCard>
  );
}
