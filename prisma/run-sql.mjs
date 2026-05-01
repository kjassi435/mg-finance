import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  url: 'libsql://mg-finance-kjassi435.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc2NDMzMzksImlkIjoiMDE5ZGUzY2MtOGMwMS03NDZkLTgwMzQtNTA2MDQzZGI0NjEyIiwicmlkIjoiYWJhNjE2OTQtMjVlMS00ZWQxLTg4N2QtNWQ5OTg3MGQwOTJiIn0.tqB17PEos4B8101BdAU5U3bWI41pLwHeMBat0xl8RaJH9xM4TVy7k-hrMPHDjs1ESZ-16CMogKOTW-wH5YFpDw',
});

async function main() {
  const sqlFilePath = path.join(process.cwd(), 'prisma', 'schema.sql');
  console.log(`Reading SQL from ${sqlFilePath}`);
  const sql = fs.readFileSync(sqlFilePath, 'utf16le').replace(/^\uFEFF/, '').trim();
  const statements = sql.split(';').filter(s => s.trim().length > 0);
  console.log(`🔌 Connecting to Turso database and executing ${statements.length} statements...`);
  for (let s of statements) {
    await client.execute(s.trim());
  }
  
  console.log('✅ Schema pushed successfully!');
  
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('\n📋 Tables in database:', tables.rows.map(r => r.name));
}

main().catch(console.error);
