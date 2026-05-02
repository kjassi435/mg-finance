import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || "libsql://mg-finance-kjassi435.aws-ap-south-1.turso.io",
  },
});
