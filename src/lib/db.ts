import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// We only initialize the adapter and client if we have the necessary credentials.
// During some build steps, environment variables might not be fully populated.
// Use bracket notation to prevent Next.js from statically replacing it with undefined at build time
let url = process.env['DATABASE_URL'] || process.env.DATABASE_URL;
let authToken = process.env['TURSO_AUTH_TOKEN'] || process.env.TURSO_AUTH_TOKEN;

if (url === "undefined" || !url) {
  url = "libsql://mg-finance-kjassi435.aws-ap-south-1.turso.io";
  // Force it into process.env so Prisma's WASM engine can read it if config is missing
  process.env.DATABASE_URL = url;
}

if (authToken === "undefined" || !authToken) {
  authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc2NDMzMzksImlkIjoiMDE5ZGUzY2MtOGMwMS03NDZkLTgwMzQtNTA2MDQzZGI0NjEyIiwicmlkIjoiYWJhNjE2OTQtMjVlMS00ZWQxLTg4N2QtNWQ5OTg3MGQwOTJiIn0.tqB17PEos4B8101BdAU5U3bWI41pLwHeMBat0xl8RaJH9xM4TVy7k-hrMPHDjs1ESZ-16CMogKOTW-wH5YFpDw";
  process.env.TURSO_AUTH_TOKEN = authToken;
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