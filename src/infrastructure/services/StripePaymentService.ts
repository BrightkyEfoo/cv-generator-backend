import Stripe from 'stripe';
import type { IPaymentService, PaymentIntent } from '../../application/interfaces/index.js';

export class StripePaymentService implements IPaymentService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(secretKey: string, webhookSecret: string) {
    this.stripe = new Stripe(secretKey);
    this.webhookSecret = webhookSecret;
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, string>
  ): Promise<PaymentIntent> {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    return {
      id: intent.id,
      clientSecret: intent.client_secret || '',
      amount: intent.amount,
      currency: intent.currency,
      status: intent.status,
    };
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      id: intent.id,
      clientSecret: intent.client_secret || '',
      amount: intent.amount,
      currency: intent.currency,
      status: intent.status,
    };
  }

  async constructWebhookEvent(payload: Buffer, signature: string): Promise<Stripe.Event> {
    return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
  }
}
