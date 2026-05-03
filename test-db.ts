import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

const url = "libsql://mg-finance-kjassi435.aws-ap-south-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc2NDMzMzksImlkIjoiMDE5ZGUzY2MtOGMwMS03NDZkLTgwMzQtNTA2MDQzZGI0NjEyIiwicmlkIjoiYWJhNjE2OTQtMjVlMS00ZWQxLTg4N2QtNWQ5OTg3MGQwOTJiIn0.tqB17PEos4B8101BdAU5U3bWI41pLwHeMBat0xl8RaJH9xM4TVy7k-hrMPHDjs1ESZ-16CMogKOTW-wH5YFpDw";

const adapter = new PrismaLibSql({ url, authToken });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@mgfinance.com' } });
  console.log("Admin user:", user);
  if (user) {
    const match = await bcrypt.compare('admin123', user.password);
    console.log("Password match for 'admin123':", match);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
