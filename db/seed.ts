import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { getDatabaseConfig } from "../lib/env";

async function seed() {
  const { url, authToken } = getDatabaseConfig();
  const client = createClient({ url, authToken });

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

  const existing = await client.execute(
    "SELECT id FROM users WHERE username = ?",
    [username]
  );

  if (existing.rows.length === 0) {
    await client.execute(
      "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
      [username, passwordHash, new Date().toISOString()]
    );
    console.log(`Admin user created: ${username}`);
  } else {
    console.log("Admin user already exists");
  }

  client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
