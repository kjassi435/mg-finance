import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// POST: Simulate processing fee payment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Find application
    const application = await db.loanApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Ensure it belongs to the authenticated user
    if (application.userId !== payload.userId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Check if already paid
    if (application.processingFeePaid) {
      return NextResponse.json(
        { error: "Processing fee has already been paid" },
        { status: 400 }
      );
    }

    // Simulate payment - update the application
    const updatedApplication = await db.loanApplication.update({
      where: { id },
      data: {
        processingFeePaid: true,
      },
    });

    // Processing fee is 1% of loan amount (simulated)
    const processingFee = Math.round(updatedApplication.loanAmount * 0.01 * 100) / 100;

    return NextResponse.json({
      message: "Processing fee payment successful",
      payment: {
        applicationId: updatedApplication.applicationId,
        processingFee,
        paidAt: new Date().toISOString(),
        status: "COMPLETED",
      },
    });
  } catch (error) {
    console.error("Pay fee error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
