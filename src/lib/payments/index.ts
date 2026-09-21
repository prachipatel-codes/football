/**
 * Offside Community Payments Abstraction
 * Current: Manual UPI / QR
 * Future: Razorpay drop-in
 */

export interface PaymentProvider {
  createOrder(amount: number, meta: any): Promise<{ orderId: string; qr?: string }>;
  verifyPayment(payload: any): Promise<boolean>;
}

export class ManualUpiProvider implements PaymentProvider {
  async createOrder(amount: number) {
    // manual flow: return static UPI details
    return {
      orderId: `manual_${Date.now()}`,
      qr: process.env.UPI_QR_URL || '',
    };
  }
  async verifyPayment() {
    // admin verifies manually
    return true;
  }
}

// Razorpay stub — swap in later
export class RazorpayProvider implements PaymentProvider {
  async createOrder(amount: number) {
    throw new Error('Razorpay not configured yet — enable RAZORPAY_KEY_ID/SECRET then implement');
  }
  async verifyPayment() {
    return false;
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.RAZORPAY_KEY_ID) return new RazorpayProvider();
  return new ManualUpiProvider();
}
