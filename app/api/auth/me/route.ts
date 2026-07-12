import { getCurrentUser } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail("UNAUTHENTICATED", "Please login.", 401);
  return ok({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    preferences: user.preference,
    waterSetting: user.waterSetting
  });
}
