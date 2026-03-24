'use server';

interface PayoutDetails {
  method: 'upi' | 'bank';
  upiId?: string;
  bankAccount?: string;
  ifscCode?: string;
  holderName: string;
}

export async function processRazorpayPayout(
  userId: string,
  email: string,
  payoutDetails: PayoutDetails,
  amountInINR: number = 50
) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const accountNumber = process.env.RAZORPAY_ACCOUNT_NUMBER;

    if (!keyId || !keySecret || !accountNumber) {
      return { success: false, error: 'Razorpay credentials not configured on the server.' };
    }

    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

    // 1. Create Contact
    const contactRes = await fetch('https://api.razorpay.com/v1/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify({
        name: payoutDetails.holderName || "Mani App User",
        email: email || "",
        reference_id: userId,
        type: "customer"
      })
    });
    const contactData = await contactRes.json();
    if (!contactRes.ok) throw new Error(contactData.error?.description || 'Failed to create contact');
    const contactId = contactData.id;

    // 2. Create Fund Account
    let fundAccountPayload;
    if (payoutDetails.method === 'upi') {
      fundAccountPayload = {
        contact_id: contactId,
        account_type: "vpa",
        vpa: { address: payoutDetails.upiId }
      };
    } else {
      fundAccountPayload = {
        contact_id: contactId,
        account_type: "bank_account",
        bank_account: {
          name: payoutDetails.holderName,
          ifsc: payoutDetails.ifscCode,
          account_number: payoutDetails.bankAccount
        }
      };
    }

    const fundAccountRes = await fetch('https://api.razorpay.com/v1/fund_accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify(fundAccountPayload)
    });
    const fundAccountData = await fundAccountRes.json();
    if (!fundAccountRes.ok) throw new Error(fundAccountData.error?.description || 'Failed to create fund account');
    const fundAccountId = fundAccountData.id;

    // 3. Create Payout
    const payoutRes = await fetch('https://api.razorpay.com/v1/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify({
        account_number: accountNumber,
        fund_account_id: fundAccountId,
        amount: Math.round(amountInINR * 100),
        currency: "INR",
        mode: payoutDetails.method === 'upi' ? "UPI" : "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: `payout_${userId}_${Date.now()}`
      })
    });
    const payoutData = await payoutRes.json();
    if (!payoutRes.ok) throw new Error(payoutData.error?.description || 'Failed to create payout');

    return { success: true, payoutId: payoutData.id };
  } catch (error: any) {
    console.error("Payout Server Action Error:", error);
    return { success: false, error: error.message || 'An unexpected error occurred during payout' };
  }
}
