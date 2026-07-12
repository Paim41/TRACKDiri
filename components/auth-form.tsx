"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { validatePasswordStrength } from "@/lib/password-strength";

type Mode = "login" | "register" | "forgot" | "reset";

export function AuthForm({ mode, token }: { mode: Mode; token?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const strength = useMemo(() => validatePasswordStrength(password), [password]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const body = {
      ...data,
      terms: data.terms === "on",
      remember: data.remember === "on",
      token
    };
    const endpoint =
      mode === "register"
        ? "/api/auth/register"
        : mode === "forgot"
          ? "/api/auth/forgot-password"
          : mode === "reset"
            ? "/api/auth/reset-password"
            : "/api/auth/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json();
    setLoading(false);
    if (!payload.success) {
      setError(payload.error.message);
      return;
    }
    if (mode === "login") {
      window.location.href = "/app/dashboard";
      return;
    }
    if (mode === "register") {
      window.location.href = "/check-your-inbox";
      return;
    }
    if (mode === "reset") {
      window.location.href = "/login?reset=success";
      return;
    }
    setMessage("If an account exists, a password reset link has been sent.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {mode === "register" ? (
        <label className="block text-sm font-bold text-track-navy">
          Full name
          <input className="track-input mt-2" name="name" autoComplete="name" required />
        </label>
      ) : null}
      {mode !== "reset" ? (
        <label className="block text-sm font-bold text-track-navy">
          Email address
          <input className="track-input mt-2" name="email" autoComplete="email" type="email" required />
        </label>
      ) : null}
      {mode !== "forgot" ? (
        <label className="block text-sm font-bold text-track-navy">
          Password
          <span className="relative mt-2 block">
            <input
              className="track-input pr-12"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-track-ocean"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
      ) : null}
      {mode === "register" || mode === "reset" ? (
        <>
          <label className="block text-sm font-bold text-track-navy">
            Confirm password
            <input className="track-input mt-2" name="confirmPassword" type="password" autoComplete="new-password" required />
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
            {Object.entries({
              "8 characters": strength.minLength,
              Uppercase: strength.uppercase,
              Lowercase: strength.lowercase,
              Number: strength.number,
              "Special character": strength.special
            }).map(([label, passed]) => (
              <span key={label} className={passed ? "text-track-success" : ""}>
                {label}
              </span>
            ))}
          </div>
        </>
      ) : null}
      {mode === "login" ? (
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 font-semibold text-track-navy">
            <input name="remember" type="checkbox" className="h-4 w-4 rounded border-track-aqua" />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-bold text-track-ocean">
            Forgot password
          </Link>
        </div>
      ) : null}
      {mode === "register" ? (
        <label className="flex items-start gap-2 text-sm font-semibold text-track-navy">
          <input name="terms" type="checkbox" className="mt-1 h-4 w-4 rounded border-track-aqua" required />
          <span>I agree to the Terms and Privacy Policy.</span>
        </label>
      ) : null}
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-track-error">{error}</p> : null}
      {message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-track-success">{message}</p> : null}
      <button type="submit" disabled={loading} className="track-button-primary flex w-full items-center justify-center gap-2 px-4">
        {loading ? <Loader2 className="animate-spin" size={18} /> : null}
        {mode === "register" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : mode === "reset" ? "Set New Password" : "Login"}
      </button>
      {mode === "login" || mode === "register" ? (
        <a href="/api/auth/google" className="track-button-secondary flex w-full items-center justify-center px-4 text-center">
          Continue with Google
        </a>
      ) : null}
      <div className="text-center text-sm font-semibold text-slate-600">
        {mode === "login" ? (
          <Link href="/register" className="text-track-ocean">Create an account</Link>
        ) : mode === "register" ? (
          <Link href="/login" className="text-track-ocean">Already have an account?</Link>
        ) : (
          <Link href="/login" className="text-track-ocean">Back to login</Link>
        )}
      </div>
    </form>
  );
}
