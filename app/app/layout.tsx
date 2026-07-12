import { headers } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  return <AppShell pathname={pathname}>{children}</AppShell>;
}
