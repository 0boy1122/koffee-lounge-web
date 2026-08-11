import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ensureDevDatabase } from "../src/dev-db";

async function main() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = await ensureDevDatabase();
  }
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const orders = await prisma.order.deleteMany({});
  const inquiries = await prisma.corporateInquiry.deleteMany({});
  console.log(`Cleared ${orders.count} test orders and ${inquiries.count} test inquiries.`);

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
