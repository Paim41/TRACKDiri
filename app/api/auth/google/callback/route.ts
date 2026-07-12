import { NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type GoogleTokenResponse = { access_token: string; id_token?: string };
type GoogleUser = { sub: string; email: string; email_verified: boolean; name: string; picture?: string };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const clientId = process.env.AUTH_GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  if (!code || !clientId || !clientSecret) return NextResponse.redirect(`${appUrl}/login?google=failed`);

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${appUrl}/api/auth/google/callback`,
      grant_type: "authorization_code"
    })
  });
  if (!tokenResponse.ok) return NextResponse.redirect(`${appUrl}/login?google=failed`);
  const token = (await tokenResponse.json()) as GoogleTokenResponse;
  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });
  if (!profileResponse.ok) return NextResponse.redirect(`${appUrl}/login?google=failed`);
  const profile = (await profileResponse.json()) as GoogleUser;

  const user = await prisma.user.upsert({
    where: { email: profile.email.toLowerCase() },
    update: {
      name: profile.name,
      imageUrl: profile.picture,
      emailVerifiedAt: profile.email_verified ? new Date() : undefined,
      status: profile.email_verified ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
      accounts: {
        upsert: {
          where: { provider_providerAccountId: { provider: "google", providerAccountId: profile.sub } },
          update: {},
          create: { provider: "google", providerAccountId: profile.sub }
        }
      }
    },
    create: {
      name: profile.name,
      email: profile.email.toLowerCase(),
      imageUrl: profile.picture,
      emailVerifiedAt: profile.email_verified ? new Date() : undefined,
      status: profile.email_verified ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
      preference: { create: {} },
      waterSetting: { create: {} },
      accounts: { create: { provider: "google", providerAccountId: profile.sub } }
    }
  });
  await createSession(user.id, true);
  return NextResponse.redirect(`${appUrl}/app/dashboard`);
}
