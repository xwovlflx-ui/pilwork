import "dotenv/config";
import { hash } from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, MembershipStatus, Role, UserStatus } from "../apps/api/src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to seed FillWork.");
if (process.env.NODE_ENV === "production") throw new Error("Development seed is disabled in production.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required before running prisma db seed.`);
  }
  return value;
}

const seedPassword = getRequiredEnv("SEED_PASSWORD");

const accounts = [
  { id: "00000000-0000-4000-8000-000000000001", name: "서비스 관리자", email: "super@fillwork.kr", role: Role.SUPER_ADMIN, status: MembershipStatus.ACTIVE },
  { id: "00000000-0000-4000-8000-000000000002", name: "김서현", email: "admin@fillwork.kr", role: Role.ORG_ADMIN, status: MembershipStatus.ACTIVE },
  { id: "00000000-0000-4000-8000-000000000003", name: "김지연", email: "field1@fillwork.kr", role: Role.MEMBER, status: MembershipStatus.ACTIVE },
  { id: "00000000-0000-4000-8000-000000000004", name: "박민수", email: "field2@fillwork.kr", role: Role.MEMBER, status: MembershipStatus.ACTIVE },
  { id: "00000000-0000-4000-8000-000000000005", name: "이서연", email: "field3@fillwork.kr", role: Role.MEMBER, status: MembershipStatus.ACTIVE },
  { id: "00000000-0000-4000-8000-000000000006", name: "최도윤", email: "pending@fillwork.kr", role: Role.MEMBER, status: MembershipStatus.PENDING },
] as const;

async function main() {
  const passwordHash = await hash(seedPassword, { type: 2 });
  const organization = await prisma.organization.upsert({
    where: { slug: "fillwork" },
    update: { name: "필워크 주식회사" },
    create: {
      id: "10000000-0000-4000-8000-000000000001",
      name: "필워크 주식회사",
      slug: "fillwork",
      seatLimit: 60,
    },
  });

  for (const account of accounts) {
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: { name: account.name, passwordHash, status: UserStatus.ACTIVE },
      create: { id: account.id, name: account.name, email: account.email, passwordHash, status: UserStatus.ACTIVE },
    });

    await prisma.membership.upsert({
      where: { organizationId_userId: { organizationId: organization.id, userId: user.id } },
      update: {
        role: account.role,
        status: account.status,
        approvedAt: account.status === MembershipStatus.ACTIVE ? new Date("2026-05-13T09:00:00.000Z") : null,
      },
      create: {
        organizationId: organization.id,
        userId: user.id,
        role: account.role,
        status: account.status,
        approvedAt: account.status === MembershipStatus.ACTIVE ? new Date("2026-05-13T09:00:00.000Z") : null,
      },
    });
  }

  console.info(`Seeded ${accounts.length} users in ${organization.name}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
