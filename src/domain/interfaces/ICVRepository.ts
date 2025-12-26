import type { CV } from '../entities/index.js';

export interface ICVRepository {
  create(cv: CV): Promise<CV>;
  findById(id: string): Promise<CV | null>;
  findBySessionId(sessionId: string): Promise<CV | null>;
  update(cv: CV): Promise<CV>;
  delete(id: string): Promise<void>;
  markAsPaid(id: string): Promise<CV>;
}
