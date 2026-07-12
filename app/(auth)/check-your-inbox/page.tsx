import Link from "next/link";
import { Mail } from "lucide-react";
import { GlassCard } from "@/components/glass";

export default function CheckYourInboxPage() {
  return (
    <GlassCard>
      <Mail className="text-track-ocean" size={34} />
      <h1 className="mt-4 font-heading text-3xl font-black text-track-ocean">Check Your Inbox</h1>
      <p className="mt-3 font-semibold leading-7 text-slate-700">
        A verification link has been prepared for your account. In development, configure SMTP to receive it by email.
      </p>
      <Link href="/login" className="track-button-primary mt-6 inline-flex px-5 py-3">Back to Login</Link>
    </GlassCard>
  );
}
