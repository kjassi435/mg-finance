import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// We only initialize the adapter and client if we have the necessary credentials.
// During some build steps, environment variables might not be fully populated.
const url = process.env.DATABASE_URL || "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const libsql = createClient({
  url,
  ...(authToken ? { authToken } : {})
});

const adapter = new PrismaLibSql(libsql);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}