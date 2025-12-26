import type { ICVRepository, IPaymentRepository } from '../../../domain/interfaces/index.js';
import type { IPaymentService } from '../../interfaces/index.js';

interface StripePaymentIntentEvent {
  type: string;
  data: {
    object: {
      id: string;
      status: string;
      metadata: {
        cvId: string;
        sessionId: string;
      };
    };
  };
}

export class HandlePaymentWebhookUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(payload: Buffer, signature: string): Promise<void> {
    const event = await this.paymentService.constructWebhookEvent(payload, signature) as StripePaymentIntentEvent;

    if (event.type === 'payment_intent.succeeded') {
      await this.handlePaymentSuccess(event.data.object);
    } else if (event.type === 'payment_intent.payment_failed') {
      await this.handlePaymentFailure(event.data.object);
    }
  }

  private async handlePaymentSuccess(paymentIntent: StripePaymentIntentEvent['data']['object']): Promise<void> {
    const payment = await this.paymentRepository.findByStripePaymentIntentId(paymentIntent.id);
    if (!payment) return;

    await this.paymentRepository.updateStatus(payment.id, 'completed');
    await this.cvRepository.markAsPaid(payment.cvId);
  }

  private async handlePaymentFailure(paymentIntent: StripePaymentIntentEvent['data']['object']): Promise<void> {
    const payment = await this.paymentRepository.findByStripePaymentIntentId(paymentIntent.id);
    if (!payment) return;

    await this.paymentRepository.updateStatus(payment.id, 'failed');
  }
}
