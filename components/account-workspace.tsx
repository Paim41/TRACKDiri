"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Loader2, Save, Shield, UserRound } from "lucide-react";

type AccountData = {
  name: string;
  email: string;
  emailVerifiedAt: string | null;
  preference: {
    timezone: string;
    measurementSystem: "METRIC" | "IMPERIAL";
    theme: "SYSTEM" | "LIGHT" | "DARK";
    reducedMotion: boolean;
    notificationEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
};

const timezoneOptions = [
  ["UTC", "UTC"],
  ["Asia/Kuala_Lumpur", "Malaysia (Kuala Lumpur)"],
  ["Asia/Singapore", "Singapore"],
  ["Asia/Jakarta", "Indonesia (Jakarta)"],
  ["Asia/Bangkok", "Thailand (Bangkok)"],
  ["Asia/Manila", "Philippines (Manila)"],
  ["Asia/Tokyo", "Japan (Tokyo)"],
  ["Asia/Seoul", "South Korea (Seoul)"],
  ["Asia/Dubai", "UAE (Dubai)"],
  ["Europe/London", "United Kingdom (London)"],
  ["Europe/Paris", "Central Europe (Paris)"],
  ["America/New_York", "US Eastern (New York)"],
  ["America/Chicago", "US Central (Chicago)"],
  ["America/Denver", "US Mountain (Denver)"],
  ["America/Los_Angeles", "US Pacific (Los Angeles)"],
  ["Australia/Sydney", "Australia (Sydney)"]
] as const;

export function AccountWorkspace({ section, account }: { section: "profile" | "settings"; account: AccountData }) {
  if (section === "settings") return <SettingsForm account={account} />;
  return <ProfileForm account={account} />;
}

function ProfileForm({ account }: { account: AccountData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") ?? ""),
        timezone: String(form.get("timezone") ?? "UTC"),
        measurementSystem: String(form.get("measurementSystem") ?? "METRIC"),
        theme: String(form.get("theme") ?? "SYSTEM"),
        reducedMotion: form.get("reducedMotion") === "on"
      })
    });
    const payload = await response.json();
    setLoading(false);
    if (!payload.success) {
      setError(payload.error.message);
      return;
    }
    setMessage("Profile saved.");
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5">
      <div className="rounded-lg border border-track-border-light bg-white/74 p-4">
        <div className="flex items-start gap-3">
          <UserRound className="mt-1 text-track-ocean" size={24} />
          <div>
            <h2 className="font-heading text-xl font-black text-track-ocean">Account Identity</h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">{account.email}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-track-navy">
            Display name
            <input name="name" className="track-input mt-1.5" defaultValue={account.name} required minLength={2} />
          </label>
          <label className="text-sm font-bold text-track-navy">
            Timezone
            <select name="timezone" className="track-input mt-1.5" defaultValue={account.preference.timezone}>
              {timezoneOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-track-navy">
            Measurement system
            <select name="measurementSystem" className="track-input mt-1.5" defaultValue={account.preference.measurementSystem}>
              <option value="METRIC">Metric</option>
              <option value="IMPERIAL">Imperial</option>
            </select>
          </label>
          <label className="text-sm font-bold text-track-navy">
            Theme
            <select name="theme" className="track-input mt-1.5" defaultValue={account.preference.theme}>
              <option value="SYSTEM">System</option>
              <option value="LIGHT">Light</option>
              <option value="DARK">Dark</option>
            </select>
          </label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold text-track-navy">
          <input name="reducedMotion" type="checkbox" defaultChecked={account.preference.reducedMotion} className="h-4 w-4 rounded border-track-aqua" />
          Reduce motion effects
        </label>
      </div>
      <SaveStatus loading={loading} message={message} error={error} label="Save Profile" />
    </form>
  );
}

function SettingsForm({ account }: { account: AccountData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationEnabled: form.get("notificationEnabled") === "on",
        quietHoursStart: String(form.get("quietHoursStart") ?? "22:00"),
        quietHoursEnd: String(form.get("quietHoursEnd") ?? "08:00")
      })
    });
    const payload = await response.json();
    setLoading(false);
    if (!payload.success) {
      setError(payload.error.message);
      return;
    }
    setMessage("Settings saved.");
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-track-border-light bg-white/74 p-4">
          <div className="flex items-start gap-3">
            <Bell className="mt-1 text-track-ocean" size={24} />
            <div>
              <h2 className="font-heading text-xl font-black text-track-ocean">Notification Settings</h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">Control reminder delivery and quiet hours.</p>
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm font-bold text-track-navy">
            <input name="notificationEnabled" type="checkbox" defaultChecked={account.preference.notificationEnabled} className="h-4 w-4 rounded border-track-aqua" />
            Enable health reminders
          </label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-bold text-track-navy">
              Quiet start
              <input name="quietHoursStart" type="time" className="track-input mt-1.5" defaultValue={account.preference.quietHoursStart} required />
            </label>
            <label className="text-sm font-bold text-track-navy">
              Quiet end
              <input name="quietHoursEnd" type="time" className="track-input mt-1.5" defaultValue={account.preference.quietHoursEnd} required />
            </label>
          </div>
        </div>
        <div className="rounded-lg border border-track-border-light bg-white/74 p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-1 text-track-ocean" size={24} />
            <div>
              <h2 className="font-heading text-xl font-black text-track-ocean">Account Security</h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">Signed in as {account.email}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3 text-sm font-semibold text-slate-700">
            <p className="flex items-center gap-2">
              <CheckCircle2 size={18} className={account.emailVerifiedAt ? "text-track-success" : "text-amber-500"} />
              {account.emailVerifiedAt ? "Email verified" : "Email verification pending"}
            </p>
            <p>Use Logout in the sidebar to end this session.</p>
            <p>Password reset is available from the login page.</p>
          </div>
        </div>
      </div>
      <SaveStatus loading={loading} message={message} error={error} label="Save Settings" />
    </form>
  );
}

function SaveStatus({ loading, message, error, label }: { loading: boolean; message: string | null; error: string | null; label: string }) {
  return (
    <div>
      {error ? <p className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-track-error">{error}</p> : null}
      {message ? <p className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-track-success">{message}</p> : null}
      <button type="submit" disabled={loading} className="track-button-primary inline-flex items-center gap-2 px-5 disabled:opacity-60">
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {label}
      </button>
    </div>
  );
}
