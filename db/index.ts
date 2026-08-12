import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { getDatabaseConfig } from "@/lib/env";

const { url, authToken } = getDatabaseConfig();

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
