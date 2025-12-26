import type { Payment } from '../../domain/entities/index.js';
import type { IPaymentRepository } from '../../domain/interfaces/index.js';
import { store } from '../persistence/InMemoryStore.js';

export class InMemoryPaymentRepository implements IPaymentRepository {
  async create(payment: Payment): Promise<Payment> {
    store.getPayments().set(payment.id, payment);
    return payment;
  }

  async findById(id: string): Promise<Payment | null> {
    return store.getPayments().get(id) || null;
  }

  async findByCvId(cvId: string): Promise<Payment | null> {
    for (const payment of store.getPayments().values()) {
      if (payment.cvId === cvId) {
        return payment;
      }
    }
    return null;
  }

  async findByStripePaymentIntentId(paymentIntentId: string): Promise<Payment | null> {
    for (const payment of store.getPayments().values()) {
      if (payment.stripePaymentIntentId === paymentIntentId) {
        return payment;
      }
    }
    return null;
  }

  async updateStatus(id: string, status: Payment['status']): Promise<Payment> {
    const payment = store.getPayments().get(id);
    if (!payment) {
      throw new Error(`Payment with id ${id} not found`);
    }
    const updated: Payment = {
      ...payment,
      status,
      completedAt: status === 'completed' ? new Date() : payment.completedAt,
    };
    store.getPayments().set(id, updated);
    return updated;
  }
}
