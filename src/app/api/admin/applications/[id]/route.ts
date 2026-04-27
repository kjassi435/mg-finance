import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// PATCH: Update application status (Admin only)
export async function PATCH(
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

    // Verify ADMIN role
    if (payload.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, rejectionReason } = body;

    // Validate status
    const validStatuses = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // If rejecting, require a reason
    if (status === "REJECTED" && !rejectionReason) {
      return NextResponse.json(
        { error: "Rejection reason is required when rejecting an application" },
        { status: 400 }
      );
    }

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

    // Build notification entry
    const notificationEntry = {
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: payload.userId,
      ...(rejectionReason ? { rejectionReason } : {}),
    };

    // Parse existing notifications
    let existingNotifications: Array<Record<string, unknown>> = [];
    if (application.notificationSent) {
      try {
        existingNotifications = JSON.parse(application.notificationSent);
      } catch {
        existingNotifications = [];
      }
    }

    existingNotifications.push(notificationEntry);

    // Update application
    const updatedApplication = await db.loanApplication.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason : application.rejectionReason,
        notificationSent: JSON.stringify(existingNotifications),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      application: updatedApplication,
      message: `Application ${status === "REJECTED" ? "rejected" : status === "APPROVED" ? "approved" : "updated"} successfully`,
    });
  } catch (error) {
    console.error("Admin update application error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE: Delete an application (Admin only)
export async function DELETE(
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

    // Verify ADMIN role
    if (payload.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
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

    // Delete application
    await db.loanApplication.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Application deleted successfully",
      applicationId: application.applicationId,
    });
  } catch (error) {
    console.error("Admin delete application error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
