import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const client = createClient({
  url: 'libsql://mg-finance-kjassi435.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzc2NDMzMzksImlkIjoiMDE5ZGUzY2MtOGMwMS03NDZkLTgwMzQtNTA2MDQzZGI0NjEyIiwicmlkIjoiYWJhNjE2OTQtMjVlMS00ZWQxLTg4N2QtNWQ5OTg3MGQwOTJiIn0.tqB17PEos4B8101BdAU5U3bWI41pLwHeMBat0xl8RaJH9xM4TVy7k-hrMPHDjs1ESZ-16CMogKOTW-wH5YFpDw',
});

async function main() {
  const email = 'admin@mgfinance.com';
  const name = 'Admin';
  const role = 'ADMIN';
  const plainPassword = 'admin123';
  
  // Check if user already exists
  const existing = await client.execute({
    sql: 'SELECT * FROM "User" WHERE email = ?',
    args: [email]
  });
  
  if (existing.rows.length > 0) {
    console.log('Admin user already exists!');
    return;
  }
  
  const salt = await bcrypt.genSalt(12);
  const password = await bcrypt.hash(plainPassword, salt);
  // Using simple cuid generation or random uuid
  const id = uuidv4();
  
  console.log('Inserting admin user...');
  await client.execute({
    sql: 'INSERT INTO "User" (id, name, email, password, role, updatedAt) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
    args: [id, name, email, password, role]
  });
  
  console.log('✅ Admin user seeded successfully!');
}

main().catch(console.error);
