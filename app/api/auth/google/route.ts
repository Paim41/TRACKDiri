import { NextResponse } from "next/server";
import { fail } from "@/lib/api";

export async function GET(request: Request) {
  const clientId = process.env.AUTH_GOOGLE_ID;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/google/callback`;
  if (!clientId) return fail("GOOGLE_NOT_CONFIGURED", "Google authentication is not configured.", 503);
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("prompt", "select_account");
  return NextResponse.redirect(url);
}
