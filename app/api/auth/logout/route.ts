import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";
import { ok } from "@/lib/api";

export async function POST(request: Request) {
  await destroySession();
  const acceptsHtml = request.headers.get("accept")?.includes("text/html");
  if (acceptsHtml) redirect("/login");
  return ok({ loggedOut: true });
}
