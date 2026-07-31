import { createClient } from "@libsql/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { getDatabaseConfig } from "../lib/env";

async function runMigrations() {
  const { url, authToken } = getDatabaseConfig();
  const client = createClient({ url, authToken });

  await client.execute(
    `CREATE TABLE IF NOT EXISTS __migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`
  );

  const migrationsDir = join(process.cwd(), "db", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const appliedResult = await client.execute("SELECT name FROM __migrations");
  const applied = new Set(appliedResult.rows.map((r) => String(r["name"])));

  let baseline = false;
  if (applied.size === 0) {
    const check = await client.execute(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('users', 'films', 'site_settings')`
    );
    if (check.rows.length > 0) {
      baseline = true;
      console.log("Existing schema detected — recording baseline migrations without re-running.");
      for (const file of files) {
        await client.execute("INSERT INTO __migrations (name) VALUES (?)", [file]);
        applied.add(file);
      }
    }
  }

  let appliedCount = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    console.log(`Running migration: ${file}`);
    const sql = readFileSync(join(migrationsDir, file), "utf-8");
    await client.executeMultiple(sql);
    await client.execute("INSERT INTO __migrations (name) VALUES (?)", [file]);
    appliedCount++;
  }

  console.log(
    baseline
      ? `Baseline recorded for ${files.length} migration(s).`
      : `Applied ${appliedCount} new migration(s). ${files.length - appliedCount} already up to date.`
  );
  client.close();
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
