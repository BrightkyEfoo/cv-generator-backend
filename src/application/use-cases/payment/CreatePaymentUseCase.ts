import type { Payment } from '../../../domain/entities/index.js';
import type { ICVRepository, IPaymentRepository } from '../../../domain/interfaces/index.js';
import type { IPaymentService } from '../../interfaces/index.js';
import type { CreatePaymentIntentDto, PaymentIntentResponseDto } from '../../dtos/index.js';
import { NotFoundError, ConflictError } from '../../../shared/errors/index.js';
import { generatePaymentId } from '../../../shared/utils/index.js';

const CV_PRICE_CENTS = 499;
const CURRENCY = 'eur';

export class CreatePaymentUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(dto: CreatePaymentIntentDto): Promise<PaymentIntentResponseDto> {
    const cv = await this.cvRepository.findById(dto.cvId);
    if (!cv) {
      throw new NotFoundError('CV', dto.cvId);
    }

    if (cv.isPaid) {
      throw new ConflictError('CV has already been paid for');
    }

    const existingPayment = await this.paymentRepository.findByCvId(dto.cvId);
    if (existingPayment && existingPayment.status === 'pending') {
      const intent = await this.paymentService.retrievePaymentIntent(existingPayment.stripePaymentIntentId);
      return {
        clientSecret: intent.clientSecret,
        paymentIntentId: intent.id,
        amount: intent.amount,
        currency: intent.currency,
      };
    }

    const paymentIntent = await this.paymentService.createPaymentIntent(
      CV_PRICE_CENTS,
      CURRENCY,
      {
        cvId: dto.cvId,
        sessionId: dto.sessionId,
      }
    );

    const payment: Payment = {
      id: generatePaymentId(),
      cvId: dto.cvId,
      sessionId: dto.sessionId,
      stripePaymentIntentId: paymentIntent.id,
      amount: CV_PRICE_CENTS,
      currency: CURRENCY,
      status: 'pending',
      createdAt: new Date(),
    };

    await this.paymentRepository.create(payment);

    return {
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }
}
