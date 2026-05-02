import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Hardcoded fallback values to guarantee no "undefined" errors
const FALLBACK_URL = "libsql://mg-finance-kjassi435.aws-ap-south-1.turso.io";
const FALLBACK_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc2NDMzMzksImlkIjoiMDE5ZGUzY2MtOGMwMS03NDZkLTgwMzQtNTA2MDQzZGI0NjEyIiwicmlkIjoiYWJhNjE2OTQtMjVlMS00ZWQxLTg4N2QtNWQ5OTg3MGQwOTJiIn0.tqB17PEos4B8101BdAU5U3bWI41pLwHeMBat0xl8RaJH9xM4TVy7k-hrMPHDjs1ESZ-16CMogKOTW-wH5YFpDw";

// Safely get env vars, treating the literal string "undefined" as empty
const getSafeEnv = (key: string, fallback: string) => {
  const val = process.env[key];
  if (!val || val === "undefined" || val === "null") {
    return fallback;
  }
  return val;
};

let rawUrl = getSafeEnv('DATABASE_URL', FALLBACK_URL);
let authToken = getSafeEnv('TURSO_AUTH_TOKEN', FALLBACK_TOKEN);

// Remove authToken from URL if it's there, as PrismaLibSql expects it separately
let cleanUrl = rawUrl;
if (cleanUrl.includes('?')) {
  cleanUrl = cleanUrl.split('?')[0];
}

// Force the env var for the Prisma WASM engine just in case it reads it directly
process.env.DATABASE_URL = cleanUrl;

const adapter = new PrismaLibSql({
  url: cleanUrl,
  authToken: authToken
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}