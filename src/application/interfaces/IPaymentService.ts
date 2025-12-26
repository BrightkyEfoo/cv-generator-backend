export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface IPaymentService {
  createPaymentIntent(amount: number, currency: string, metadata: Record<string, string>): Promise<PaymentIntent>;
  retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent>;
  constructWebhookEvent(payload: Buffer, signature: string): Promise<unknown>;
}
