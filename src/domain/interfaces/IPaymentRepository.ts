import type { Payment } from '../entities/index.js';

export interface IPaymentRepository {
  create(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByCvId(cvId: string): Promise<Payment | null>;
  findByStripePaymentIntentId(paymentIntentId: string): Promise<Payment | null>;
  updateStatus(id: string, status: Payment['status']): Promise<Payment>;
}
