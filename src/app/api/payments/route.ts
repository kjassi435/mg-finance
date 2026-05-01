import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { createPaymentOrder, verifyPayment } from "@/lib/payments";

// POST: Create payment order for application processing fee
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    // Find the application belonging to this user
    const application = await db.loanApplication.findFirst({
      where: { id: applicationId, userId: payload.userId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.processingFeePaid) {
      return NextResponse.json({ error: "Processing fee already paid" }, { status: 400 });
    }

    // Create payment order
    const result = await createPaymentOrder({
      applicationId: application.applicationId,
      userId: payload.userId,
      userEmail: application.email,
      customerPhone: application.phone,
      customerName: application.fullName,
    });

    if (!result.success || !result.order) {
      return NextResponse.json({ error: result.error || "Failed to create payment order" }, { status: 500 });
    }

    // Update application with payment order ID
    await db.loanApplication.update({
      where: { id: applicationId },
      data: {
        paymentOrderId: result.order.orderId,
        paymentAmount: result.order.amount,
        paymentStatus: "PENDING",
      },
    });

    return NextResponse.json({
      order: result.order,
      message: "Payment order created successfully",
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PATCH: Verify and complete payment
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, orderId, transactionId } = body;

    if (!applicationId || !orderId) {
      return NextResponse.json({ error: "Application ID and Order ID are required" }, { status: 400 });
    }

    const application = await db.loanApplication.findFirst({
      where: { id: applicationId, userId: payload.userId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const result = await verifyPayment({ orderId, transactionId });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Payment verification failed" }, { status: 500 });
    }

    if (result.verified) {
      const updated = await db.loanApplication.update({
        where: { id: applicationId },
        data: {
          processingFeePaid: true,
          paymentStatus: "COMPLETED",
          paymentCompletedAt: new Date(),
        },
      });

      return NextResponse.json({
        application: updated,
        verified: true,
        message: "Payment verified and processing fee marked as paid",
      });
    } else {
      await db.loanApplication.update({
        where: { id: applicationId },
        data: { paymentStatus: "FAILED" },
      });

      return NextResponse.json({
        verified: false,
        message: "Payment verification failed. Please try again.",
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
