import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// Helper to extract and verify JWT from request
async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }), payload: null };
  }

  const token = authHeader.split(" ")[1];
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return { error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }), payload: null };
  }

  return { error: null, payload };
}

// Helper to generate unique application ID
async function generateApplicationId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `MG-${year}-`;

  // Find the latest application for this year
  const latestApplication = await db.loanApplication.findFirst({
    where: {
      applicationId: {
        startsWith: prefix,
      },
    },
    orderBy: {
      applicationId: "desc",
    },
  });

  let nextNumber = 1;
  if (latestApplication) {
    const parts = latestApplication.applicationId.split("-");
    const lastNumber = parseInt(parts[parts.length - 1], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}

// Calculate EMI: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const r = annualRate / 12 / 100; // Monthly interest rate
  if (r === 0) return principal / tenureMonths;
  const factor = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * factor) / (factor - 1);
  return Math.round(emi * 100) / 100; // Round to 2 decimal places
}

// POST: Create a new loan application
export async function POST(request: NextRequest) {
  try {
    const { error, payload } = await authenticateRequest(request);
    if (error) return error;

    const body = await request.json();
    const {
      loanType,
      loanAmount,
      interestRate,
      tenure,
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      pincode,
      employmentType,
      employerName,
      monthlyIncome,
      workExperience,
      aadhaarNumber,
      panNumber,
      itrFiled,
      fatherName,
      alternatePhone,
      permanentAddress,
      loanPurpose,
      existingLoan,
      existingLoanDetails,
      existingEmi,
      approxCibilScore,
      bankStatement,
      salarySlip,
      passportPhoto,
      declarationAccepted,
    } = body;

    // Validate required fields
    if (!loanType || !loanAmount || !interestRate || !tenure || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Loan type, amount, interest rate, tenure, full name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Validate loan amount
    if (loanAmount <= 0) {
      return NextResponse.json(
        { error: "Loan amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Validate tenure
    if (tenure <= 0) {
      return NextResponse.json(
        { error: "Tenure must be greater than 0 months" },
        { status: 400 }
      );
    }

    // Generate application ID
    const applicationId = await generateApplicationId();

    // Calculate EMI
    const monthlyEmi = calculateEMI(loanAmount, interestRate, tenure);

    // Create the loan application
    const application = await db.loanApplication.create({
      data: {
        applicationId,
        userId: payload!.userId,
        loanType,
        loanAmount,
        interestRate,
        tenure,
        monthlyEmi,
        fullName,
        email,
        phone,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        address: address || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        employmentType: employmentType || null,
        employerName: employerName || null,
        monthlyIncome: monthlyIncome ? Number(monthlyIncome) : null,
        workExperience: workExperience || null,
        aadhaarNumber: aadhaarNumber || null,
        panNumber: panNumber || null,
        itrFiled: itrFiled || false,
        fatherName: fatherName || null,
        alternatePhone: alternatePhone || null,
        permanentAddress: permanentAddress || null,
        loanPurpose: loanPurpose || null,
        existingLoan: existingLoan || null,
        existingLoanDetails: existingLoanDetails || null,
        existingEmi: existingEmi || null,
        approxCibilScore: approxCibilScore || null,
        bankStatement: bankStatement || false,
        salarySlip: salarySlip || false,
        passportPhoto: passportPhoto || false,
        declarationAccepted: declarationAccepted || false,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// GET: Get all applications for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { error, payload } = await authenticateRequest(request);
    if (error) return error;

    const applications = await db.loanApplication.findMany({
      where: {
        userId: payload!.userId,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
