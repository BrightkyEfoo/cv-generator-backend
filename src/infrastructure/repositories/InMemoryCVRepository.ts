import type { CV } from '../../domain/entities/index.js';
import type { ICVRepository } from '../../domain/interfaces/index.js';
import { store } from '../persistence/InMemoryStore.js';

export class InMemoryCVRepository implements ICVRepository {
  async create(cv: CV): Promise<CV> {
    store.getCVs().set(cv.id, cv);
    return cv;
  }

  async findById(id: string): Promise<CV | null> {
    return store.getCVs().get(id) || null;
  }

  async findBySessionId(sessionId: string): Promise<CV | null> {
    for (const cv of store.getCVs().values()) {
      if (cv.sessionId === sessionId) {
        return cv;
      }
    }
    return null;
  }

  async update(cv: CV): Promise<CV> {
    store.getCVs().set(cv.id, cv);
    return cv;
  }

  async delete(id: string): Promise<void> {
    store.getCVs().delete(id);
  }

  async markAsPaid(id: string): Promise<CV> {
    const cv = store.getCVs().get(id);
    if (!cv) {
      throw new Error(`CV with id ${id} not found`);
    }
    const updated = { ...cv, isPaid: true };
    store.getCVs().set(id, updated);
    return updated;
  }
}
