import { NextResponse } from "next/server";
import { seedAdminUser } from "@/lib/seed";

export async function POST() {
  try {
    const result = await seedAdminUser();
    return NextResponse.json(result, { status: result.message.includes("already") ? 200 : 201 });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed admin user" },
      { status: 500 }
    );
  }
}
