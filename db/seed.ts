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

  const categories = [
    ["gallery", "Wedding", "wedding"],
    ["gallery", "Seemantham", "seemantham"],
    ["gallery", "Reception", "reception"],
    ["gallery", "Pre Shoot", "preshoot"],
    ["gallery", "Other", "other"],
    ["films", "Modern", "modern"],
    ["films", "Classic", "classic"],
    ["films", "Intimates", "intimates"],
    ["films", "Cinematic", "cinematic"],
    ["services", "Wedding", "wedding"],
    ["services", "Seemantham", "seemantham"],
    ["services", "Reception", "reception"],
    ["services", "Pre Shoot", "preshoot"],
    ["services", "Other", "other"],
  ] as const;

  for (const [order, [type, name, slug]] of categories.entries()) {
    await prisma.category.upsert({
      where: { type_slug: { type, slug } },
      update: { name },
      create: { type, name, slug, order },
    });
  }

  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
