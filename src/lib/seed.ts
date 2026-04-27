import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function seedAdminUser() {
  const adminEmail = "admin@mgfinance.com";
  const adminPassword = "admin123";
  const adminName = "Admin";

  // Check if admin user already exists
  const existingAdmin = await db.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin user already exists:", adminEmail);
    return {
      message: "Admin user already exists",
      user: {
        id: existingAdmin.id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role,
      },
    };
  }

  // Create admin user
  const hashedPassword = await hashPassword(adminPassword);
  const admin = await db.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", adminEmail);
  return {
    message: "Admin user created successfully",
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
}
