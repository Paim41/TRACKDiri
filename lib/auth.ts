import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Role, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createToken, hashToken } from "@/lib/tokens";

const SESSION_COOKIE = "trackdiri_session";

export async function createSession(userId: string, remember = false) {
  const token = createToken();
  const expiresAt = new Date(Date.now() + (remember ? 30 : 7) * 24 * 60 * 60 * 1000);
  const headersList = await headers();

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      userAgent: headersList.get("user-agent"),
      ipAddress: headersList.get("x-forwarded-for")?.split(",")[0]?.trim()
    }
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { tokenHash: hashToken(token), revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { preference: true, waterSetting: true } } }
  });

  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;
  if (session.user.status !== UserStatus.ACTIVE) return null;

  await prisma.session.update({
    where: { id: session.id },
    data: { lastActiveAt: new Date() }
  });

  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdministrator() {
  const user = await requireUser();
  if (user.role !== Role.ADMINISTRATOR) redirect("/app/dashboard");
  return user;
}
