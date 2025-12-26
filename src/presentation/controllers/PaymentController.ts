import type { Request, Response } from 'express';
import type { CreatePaymentUseCase, HandlePaymentWebhookUseCase } from '../../application/use-cases/index.js';

export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly handlePaymentWebhookUseCase: HandlePaymentWebhookUseCase
  ) {}

  async createPaymentIntent(req: Request, res: Response): Promise<void> {
    const result = await this.createPaymentUseCase.execute({
      cvId: req.params.cvId,
      sessionId: req.sessionId,
    });
    res.json(result);
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const signature = req.headers['stripe-signature'] as string;
    await this.handlePaymentWebhookUseCase.execute(req.body, signature);
    res.json({ received: true });
  }
}
