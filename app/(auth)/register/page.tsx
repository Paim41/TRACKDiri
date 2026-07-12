import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand";
import { GlassCard } from "@/components/glass";

export default function RegisterPage() {
  return (
    <GlassCard>
      <div className="mb-6">
        <BrandMark />
        <h1 className="mt-6 font-heading text-3xl font-black text-track-ocean">Create Account</h1>
      </div>
      <AuthForm mode="register" />
    </GlassCard>
  );
}
