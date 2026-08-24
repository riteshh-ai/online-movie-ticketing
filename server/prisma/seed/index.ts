import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Bootstraps the one thing the app cannot function without: a super-admin
// account. Replaces legacy's hardcoded admin@gmail.com/admin1234 check in
// Admin/index.php with a real AdminUser row (role SUPER_ADMIN, cinemaId
// null). Everything else (genres, cinemas, sample movies, etc.) is real data
// and belongs in scripts/migrate-data/, not here — see migration.md "Data
// migration" and scripts/migrate-data/README.md.
async function main() {
  const email = process.env.SEED_SUPERADMIN_EMAIL;
  const password = process.env.SEED_SUPERADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set SEED_SUPERADMIN_EMAIL and SEED_SUPERADMIN_PASSWORD in server/.env before seeding.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      username: "superadmin",
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      cinemaId: null,
    },
  });

  console.log(`Seeded super-admin: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
