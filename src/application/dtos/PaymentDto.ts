export interface CreatePaymentIntentDto {
  cvId: string;
  sessionId: string;
}

export interface PaymentIntentResponseDto {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface PaymentStatusDto {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  cvId: string;
  isPaid: boolean;
}

export interface WebhookEventDto {
  type: string;
  data: Record<string, unknown>;
}
