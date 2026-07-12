import { PrismaClient, Role, UserStatus } from "@prisma/client";
import { hashPassword } from "@/lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SETUP_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.SETUP_ADMIN_PASSWORD;
  const name = process.env.SETUP_ADMIN_NAME ?? "TRACKDiri Administrator";
  if (!email || !password) {
    throw new Error("SETUP_ADMIN_EMAIL and SETUP_ADMIN_PASSWORD are required.");
  }
  const passwordHash = await hashPassword(password);
  await prisma.user.upsert({
    where: { email },
    update: { role: Role.ADMINISTRATOR, status: UserStatus.ACTIVE, passwordHash },
    create: {
      email,
      name,
      passwordHash,
      role: Role.ADMINISTRATOR,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      preference: { create: {} },
      waterSetting: { create: {} }
    }
  });
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
