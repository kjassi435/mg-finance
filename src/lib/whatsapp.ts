// WhatsApp Business API Notification Helper
// Integrates with Interakt / Twilio / MSG91 for automated status alerts

interface WhatsAppConfig {
  apiKey: string;
  apiUrl: string;
  enabled: boolean;
}

const config: WhatsAppConfig = {
  apiKey: process.env.WHATSAPP_API_KEY || '',
  apiUrl: process.env.WHATSAPP_API_URL || 'https://api.interakt.ai/v1/public/message',
  enabled: !!process.env.WHATSAPP_API_KEY,
};

interface NotificationPayload {
  phone: string;       // User's registered phone number (with country code)
  name: string;        // User's full name
  applicationId: string; // Application reference ID
  status: string;      // New status (APPROVED, REJECTED, UNDER_REVIEW)
  loanType: string;    // Type of loan applied for
  loanAmount: number;  // Loan amount requested
  rejectionReason?: string; // Reason if rejected
}

const STATUS_TEMPLATES: Record<string, { en: string; hi: string }> = {
  APPROVED: {
    en: `Congratulations {name}! 🎉\n\nYour loan application {applicationId} for {loanType} ({amount}) has been APPROVED by MG Financial Services.\n\nOur team will contact you shortly for the next steps.\n\nThank you for choosing MG Finance!\n📞 +91 78954 07790`,
    hi: `बधाई हो {name}! 🎉\n\nआपका लोन आवेदन {applicationId} ({loanType} - {amount}) MG Financial Services द्वारा APPROVED कर दिया गया है।\n\nहमारी टीम जल्द ही आपसे संपर्क करेगी।\n\nMG Finance का धन्यवाद!\n📞 +91 78954 07790`,
  },
  REJECTED: {
    en: `Dear {name},\n\nYour loan application {applicationId} has been reviewed. Unfortunately, we are unable to approve it at this time.\n\nReason: {reason}\n\nYou may reapply after addressing the above points. For assistance, call us at +91 78954 07790.\n\n- MG Financial Services`,
    hi: `प्रिय {name},\n\nआपका लोन आवेदन {applicationId} की समीक्षा की गई। दुर्भाग्य से, इस समय इसे स्वीकृत नहीं किया जा सका।\n\nकारण: {reason}\n\nआप उपरोक्त बिंदुओं को ठीक करने के बाद पुनः आवेदन कर सकते हैं। सहायता के लिए हमें कॉल करें: +91 78954 07790\n\n- MG Financial Services`,
  },
  UNDER_REVIEW: {
    en: `Dear {name},\n\nYour loan application {applicationId} is now UNDER REVIEW at MG Financial Services.\n\nOur team is carefully evaluating your application. We will update you within 24-48 hours.\n\nFor any queries, call: +91 78954 07790\n\n- MG Finance`,
    hi: `प्रिय {name},\n\nआपका लोन आवेदन {applicationId} अब MG Financial Services द्वारा UNDER REVIEW में है।\n\nहमारी टीम आपके आवेदन की सावधानीपूर्वक जांच कर रही है। हम 24-48 घंटे में आपको अपडेट करेंगे।\n\nकिसी भी पूछताछ के लिए कॉल करें: +91 78954 07790\n\n- MG Finance`,
  },
};

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function formatPhone(phone: string): string {
  // Ensure phone number has country code
  let formatted = phone.replace(/\D/g, '');
  if (!formatted.startsWith('91')) {
    formatted = '91' + formatted;
  }
  return formatted;
}

function buildMessage(payload: NotificationPayload, lang: 'en' | 'hi' = 'en'): string {
  const template = STATUS_TEMPLATES[payload.status];
  if (!template) return '';

  const message = template[lang]
    .replace(/{name}/g, payload.name)
    .replace(/{applicationId}/g, payload.applicationId)
    .replace(/{loanType}/g, payload.loanType)
    .replace(/{amount}/g, formatCurrency(payload.loanAmount))
    .replace(/{reason}/g, payload.rejectionReason || 'Not specified');

  return message;
}

export async function sendWhatsAppNotification(payload: NotificationPayload): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  // If WhatsApp API is not configured, log the notification
  if (!config.enabled) {
    console.log('=== WhatsApp Notification (SIMULATED) ===');
    console.log(`Phone: ${formatPhone(payload.phone)}`);
    console.log(`Status: ${payload.status}`);
    console.log(`English Message:\n${buildMessage(payload, 'en')}`);
    console.log(`Hindi Message:\n${buildMessage(payload, 'hi')}`);
    console.log('=== END NOTIFICATION ===');
    return { success: true, messageId: `SIMULATED-${Date.now()}` };
  }

  try {
    const phone = formatPhone(payload.phone);
    const message = buildMessage(payload, 'en');

    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(config.apiKey + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        countryCode: '91',
        phoneNumber: phone.replace(/^91/, ''),
        type: 'Template',
        template: {
          name: `loan_status_${payload.status.toLowerCase()}`,
          languageCode: 'en',
          bodyValues: [payload.name, payload.applicationId, payload.loanType, formatCurrency(payload.loanAmount)],
        },
        ...(payload.status === 'REJECTED' && payload.rejectionReason
          ? { callbackText: payload.rejectionReason }
          : {}),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API error:', data);
      return { success: false, error: data.message || 'API call failed' };
    }

    return { success: true, messageId: data.messageId || data.id };
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}

// Notify on status change (called from admin API)
export async function notifyStatusChange(params: {
  phone: string;
  name: string;
  applicationId: string;
  status: string;
  loanType: string;
  loanAmount: number;
  rejectionReason?: string;
}): Promise<void> {
  const result = await sendWhatsAppNotification(params);
  if (!result.success) {
    console.error(`Failed to send WhatsApp notification for ${params.applicationId}:`, result.error);
  }
}
