import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// We only initialize the adapter and client if we have the necessary credentials.
// During some build steps, environment variables might not be fully populated.
let url = process.env.DATABASE_URL;
let authToken = process.env.TURSO_AUTH_TOKEN;

// Fix for Vercel injecting literal "undefined" string when env var is missing
if (url === "undefined" || !url) {
  url = "file:./dev.db"; // fallback for local
}

if (authToken === "undefined") {
  authToken = undefined;
}

const libsql = createClient({
  url: url,
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