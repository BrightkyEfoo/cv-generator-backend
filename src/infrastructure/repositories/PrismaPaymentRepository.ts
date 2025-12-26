import type { PrismaClient, Payment as PrismaPayment } from '@prisma/client';
import type { Payment } from '../../domain/entities/index.js';
import type { IPaymentRepository } from '../../domain/interfaces/index.js';

export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(prismaPayment: PrismaPayment): Payment {
    return {
      id: prismaPayment.id,
      cvId: prismaPayment.cvId,
      sessionId: prismaPayment.sessionId,
      stripePaymentIntentId: prismaPayment.stripePaymentIntentId,
      amount: prismaPayment.amount,
      currency: prismaPayment.currency,
      status: prismaPayment.status as Payment['status'],
      createdAt: prismaPayment.createdAt,
      completedAt: prismaPayment.completedAt || undefined,
    };
  }

  async create(payment: Payment): Promise<Payment> {
    const created = await this.prisma.payment.create({
      data: {
        id: payment.id,
        cvId: payment.cvId,
        sessionId: payment.sessionId,
        stripePaymentIntentId: payment.stripePaymentIntentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    return payment ? this.toDomain(payment) : null;
  }

  async findByCvId(cvId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { cvId } });
    return payment ? this.toDomain(payment) : null;
  }

  async findByStripePaymentIntentId(paymentIntentId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
    });
    return payment ? this.toDomain(payment) : null;
  }

  async updateStatus(id: string, status: Payment['status']): Promise<Payment> {
    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'completed' ? new Date() : undefined,
      },
    });
    return this.toDomain(updated);
  }
}
