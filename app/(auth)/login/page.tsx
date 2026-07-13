import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand";
import { GlassCard } from "@/components/glass";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/app/dashboard");

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
