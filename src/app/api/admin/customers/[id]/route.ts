import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET: Get detailed info for a single customer including their applications
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id } = await params;

    const customer = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        applications: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            applicationId: true,
            loanType: true,
            loanAmount: true,
            interestRate: true,
            tenure: true,
            status: true,
            processingFeePaid: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const totalApplications = customer.applications.length;
    const approvedCount = customer.applications.filter((a) => a.status === "APPROVED").length;
    const pendingCount = customer.applications.filter((a) => a.status === "PENDING" || a.status === "UNDER_REVIEW").length;
    const totalLoanAmount = customer.applications.reduce((sum, a) => sum + a.loanAmount, 0);
    const feesPaid = customer.applications.filter((a) => a.processingFeePaid).length;

    return NextResponse.json({
      customer: {
        ...customer,
        stats: {
          totalApplications,
          approvedCount,
          pendingCount,
          totalLoanAmount,
          feesPaid,
        },
      },
    });
  } catch (error) {
    console.error("Admin get customer detail error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
