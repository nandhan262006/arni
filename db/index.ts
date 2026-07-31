import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { getDatabaseConfig } from "@/lib/env";

const { url, authToken } = getDatabaseConfig();

let client: ReturnType<typeof createClient>;

if (process.env.NODE_ENV === "production") {
  client = createClient({
    url,
    authToken,
  });
} else {
  const globalForDb = globalThis as unknown as {
    dbClient?: ReturnType<typeof createClient>;
  };
  if (!globalForDb.dbClient) {
    globalForDb.dbClient = createClient({
      url,
      authToken,
    });
  }
  client = globalForDb.dbClient;
}

export const db = drizzle(client, { schema });
export { schema };
