import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import { getDatabaseConfig } from "../lib/env";

async function seed() {
  const { url, authToken } = getDatabaseConfig();
  const adapter = new PrismaLibSql({ url, authToken });
  const prisma = new PrismaClient({ adapter });

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD) {
    console.error(
      "Refusing to seed with the default password in production. " +
        "Set ADMIN_PASSWORD to a strong password before running db:seed."
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { username } });

  if (!existing) {
    await prisma.user.create({ data: { username, passwordHash } });
    console.log(`Admin user created: ${username}`);
  } else {
    console.log("Admin user already exists");
  }

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
