import { createClient } from "@libsql/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

async function runMigrations() {
  const url = process.env.TURSO_DATABASE_URL || "file:./local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const client = createClient({ url, authToken });

  const migrationsDir = join(process.cwd(), "db", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    console.log(`Running migration: ${file}`);
    const sql = readFileSync(join(migrationsDir, file), "utf-8");
    await client.executeMultiple(sql);
  }

  console.log(`Applied ${files.length} migration(s)`);
  client.close();
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
