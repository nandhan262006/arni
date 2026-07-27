import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

async function seed() {
  const url = process.env.TURSO_DATABASE_URL || "file:./local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const client = createClient({ url, authToken });

  const passwordHash = await bcrypt.hash("admin123", 12);

  const existing = await client.execute(
    "SELECT id FROM users WHERE username = ?",
    ["admin"]
  );

  if (existing.rows.length === 0) {
    await client.execute(
      "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
      ["admin", passwordHash, new Date().toISOString()]
    );
    console.log("Admin user created: admin / admin123");
  } else {
    console.log("Admin user already exists");
  }

  client.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
