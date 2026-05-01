// Payment Gateway Integration Helper
// Supports Kwik UPI / Paytm for ₹499 processing fee

interface PaymentConfig {
  merchantKey: string;
  merchantId: string;
  apiUrl: string;
  callbackUrl: string;
  enabled: boolean;
}

const config: PaymentConfig = {
  merchantKey: process.env.PAYTM_MERCHANT_KEY || '',
  merchantId: process.env.PAYTM_MID || '',
  apiUrl: process.env.PAYMENT_API_URL || 'https://securegw.paytm.in/theia/api/v1/order',
  callbackUrl: process.env.PAYMENT_CALLBACK_URL || '/api/payments/callback',
  enabled: !!process.env.PAYTM_MERCHANT_KEY,
};

const PROCESSING_FEE = 499;

interface CreateOrderParams {
  applicationId: string;
  userId: string;
  userEmail: string;
  customerPhone: string;
  customerName: string;
}

interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paymentUrl?: string;
  upiLink?: string;
}

interface VerifyPaymentParams {
  orderId: string;
  transactionId?: string;
}

// Generate unique order ID
function generateOrderId(applicationId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MGFEE-${applicationId}-${timestamp}${random}`;
}

// Create a payment order for the processing fee
export async function createPaymentOrder(params: CreateOrderParams): Promise<{
  success: boolean;
  order?: PaymentOrder;
  error?: string;
}> {
  const orderId = generateOrderId(params.applicationId);

  // If payment gateway is not configured, create a simulated order
  if (!config.enabled) {
    console.log('=== Payment Order (SIMULATED) ===');
    console.log(`Order ID: ${orderId}`);
    console.log(`Application ID: ${params.applicationId}`);
    console.log(`Amount: ₹${PROCESSING_FEE}`);
    console.log(`Customer: ${params.customerName} (${params.userEmail})`);
    console.log('=== END PAYMENT ORDER ===');

    return {
      success: true,
      order: {
        orderId,
        amount: PROCESSING_FEE,
        currency: 'INR',
        status: 'PENDING',
        upiLink: `upi://pay?pa=mgfinance@upi&pn=MG%20Finance&am=${PROCESSING_FEE}&cu=INR&tn=Loan%20Processing%20Fee%20${params.applicationId}`,
      },
    };
  }

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': config.merchantId,
        'x-client-secret': config.merchantKey,
      },
      body: JSON.stringify({
        orderId,
        amount: PROCESSING_FEE * 100, // Amount in paise
        currency: 'INR',
        customerId: params.userId,
        customerEmail: params.userEmail,
        customerPhone: params.customerPhone,
        customerName: params.customerName,
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}${config.callbackUrl}`,
        metadata: {
          applicationId: params.applicationId,
          feeType: 'PROCESSING_FEE',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Payment gateway error:', data);
      return { success: false, error: data.message || 'Failed to create order' };
    }

    return {
      success: true,
      order: {
        orderId: data.orderId || orderId,
        amount: PROCESSING_FEE,
        currency: 'INR',
        status: 'PENDING',
        paymentUrl: data.paymentUrl,
        upiLink: data.upiLink,
      },
    };
  } catch (error) {
    console.error('Create payment order error:', error);
    return { success: false, error: 'Failed to create payment order' };
  }
}

// Verify a payment transaction
export async function verifyPayment(params: VerifyPaymentParams): Promise<{
  success: boolean;
  verified: boolean;
  transactionId?: string;
  error?: string;
}> {
  // If payment gateway is not configured, simulate successful verification
  if (!config.enabled) {
    console.log('=== Payment Verification (SIMULATED) ===');
    console.log(`Order ID: ${params.orderId}`);
    console.log(`Status: VERIFIED`);
    console.log('=== END VERIFICATION ===');

    return {
      success: true,
      verified: true,
      transactionId: `TXN-${Date.now()}`,
    };
  }

  try {
    const response = await fetch(`${config.apiUrl}/${params.orderId}/status`, {
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': config.merchantId,
        'x-client-secret': config.merchantKey,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, verified: false, error: data.message || 'Verification failed' };
    }

    const isPaid = data.status === 'TXN_SUCCESS' || data.status === 'COMPLETED';

    return {
      success: true,
      verified: isPaid,
      transactionId: data.transactionId || params.transactionId,
    };
  } catch (error) {
    console.error('Verify payment error:', error);
    return { success: false, verified: false, error: 'Verification failed' };
  }
}

// Get processing fee amount
export function getProcessingFee(): number {
  return PROCESSING_FEE;
}

// Get payment configuration status
export function isPaymentGatewayEnabled(): boolean {
  return config.enabled;
}
