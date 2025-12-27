import type { ICVRepository } from '../../../domain/interfaces/index.js';
import type { IPDFService } from '../../interfaces/index.js';
import { NotFoundError, PaymentRequiredError } from '../../../shared/errors/index.js';

export class ExportCVUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly pdfService: IPDFService
  ) {}

  async generatePreview(cvId: string): Promise<Buffer> {
    const cv = await this.cvRepository.findById(cvId);
    if (!cv) {
      throw new NotFoundError('CV', cvId);
    }
    return this.pdfService.generateWithWatermark(cv);
  }

  async generatePreviewImage(cvId: string): Promise<Buffer> {
    const cv = await this.cvRepository.findById(cvId);
    if (!cv) {
      throw new NotFoundError('CV', cvId);
    }
    return this.pdfService.generatePreviewImage(cv);
  }

  async generatePreviewImages(cvId: string): Promise<Buffer[]> {
    const cv = await this.cvRepository.findById(cvId);
    if (!cv) {
      throw new NotFoundError('CV', cvId);
    }
    return this.pdfService.generatePreviewImages(cv);
  }

  async generateDownload(cvId: string): Promise<Buffer> {
    const cv = await this.cvRepository.findById(cvId);
    if (!cv) {
      throw new NotFoundError('CV', cvId);
    }

    if (!cv.isPaid) {
      throw new PaymentRequiredError('Payment required to download CV without watermark');
    }

    const pdf = await this.pdfService.generateFull(cv);

    await this.cvRepository.update({
      ...cv,
      metadata: {
        ...cv.metadata,
        lastExportedAt: new Date(),
      },
    });

    return pdf;
  }
}
