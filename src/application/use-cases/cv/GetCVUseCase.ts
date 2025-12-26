import type { CV } from '../../../domain/entities/index.js';
import type { ICVRepository } from '../../../domain/interfaces/index.js';
import { NotFoundError } from '../../../shared/errors/index.js';

export class GetCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  async getById(cvId: string): Promise<CV> {
    const cv = await this.cvRepository.findById(cvId);
    if (!cv) {
      throw new NotFoundError('CV', cvId);
    }
    return cv;
  }

  async getBySessionId(sessionId: string): Promise<CV> {
    const cv = await this.cvRepository.findBySessionId(sessionId);
    if (!cv) {
      throw new NotFoundError('CV for session', sessionId);
    }
    return cv;
  }
}
