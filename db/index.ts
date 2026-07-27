import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

let client: ReturnType<typeof createClient>;

if (process.env.NODE_ENV === "production") {
  client = createClient({
    url: tursoUrl!,
    authToken: tursoToken!,
  });
} else {
  const globalForDb = globalThis as unknown as {
    dbClient?: ReturnType<typeof createClient>;
  };
  if (!globalForDb.dbClient) {
    globalForDb.dbClient = createClient({
      url: tursoUrl || "file:./local.db",
      authToken: tursoToken,
    });
  }
  client = globalForDb.dbClient;
}

export const db = drizzle(client, { schema });
export { schema };
