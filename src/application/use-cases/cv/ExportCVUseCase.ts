import type { ICVRepository, IAppSettingsRepository } from '../../../domain/interfaces/index.js';
import type { IPDFService } from '../../interfaces/index.js';
import { NotFoundError, PaymentRequiredError } from '../../../shared/errors/index.js';
import * as fs from 'fs';
import * as path from 'path';

export class ExportCVUseCase {
  private readonly cvExportDir: string;

  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly pdfService: IPDFService,
    private readonly settingsRepository?: IAppSettingsRepository
  ) {
    // Directory to save downloaded CVs
    this.cvExportDir = process.env.CV_EXPORT_DIR || './cv-exports';

    // Ensure export directory exists
    if (!fs.existsSync(this.cvExportDir)) {
      fs.mkdirSync(this.cvExportDir, { recursive: true });
    }
  }

  private async isFreeDownloadsEnabled(): Promise<boolean> {
    // If settings repository is available, use database setting
    if (this.settingsRepository) {
      const settings = await this.settingsRepository.get();
      return settings.freeDownloads;
    }
    // Fallback to environment variable
    return process.env.FREE_DOWNLOADS === 'true';
  }

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

  async generateDownload(cvId: string, skipPaymentCheck = false): Promise<Buffer> {
    const cv = await this.cvRepository.findById(cvId);
    if (!cv) {
      throw new NotFoundError('CV', cvId);
    }

    // Check payment unless free downloads are enabled or skipPaymentCheck is true (admin)
    if (!skipPaymentCheck) {
      const freeDownloads = await this.isFreeDownloadsEnabled();
      if (!freeDownloads && !cv.isPaid) {
        throw new PaymentRequiredError('Payment required to download CV without watermark');
      }
    }

    const pdf = await this.pdfService.generateFull(cv);

    // Save a copy of the CV to the export directory
    await this.saveCVExport(cv, pdf);

    await this.cvRepository.update({
      ...cv,
      metadata: {
        ...cv.metadata,
        lastExportedAt: new Date(),
      },
    });

    return pdf;
  }

  async execute(params: { cvId: string; format?: 'pdf' | 'png'; skipPaymentCheck?: boolean }): Promise<{ data: Buffer; contentType: string }> {
    const { cvId, format = 'pdf', skipPaymentCheck = false } = params;

    if (format === 'png') {
      const data = await this.generatePreviewImage(cvId);
      return { data, contentType: 'image/png' };
    }

    const data = await this.generateDownload(cvId, skipPaymentCheck);
    return { data, contentType: 'application/pdf' };
  }

  private async saveCVExport(cv: { personalInfo: { firstName: string; lastName: string } }, pdf: Buffer): Promise<void> {
    try {
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS

      // Sanitize name for filename
      const firstName = cv.personalInfo.firstName.replace(/[^a-zA-Z0-9]/g, '_');
      const lastName = cv.personalInfo.lastName.replace(/[^a-zA-Z0-9]/g, '_');

      const filename = `${lastName}_${firstName}_${dateStr}_${timeStr}.pdf`;
      const filePath = path.join(this.cvExportDir, filename);

      fs.writeFileSync(filePath, pdf);
      console.log(`CV exported to: ${filePath}`);
    } catch (error) {
      // Log error but don't fail the download
      console.error('Failed to save CV export:', error);
    }
  }
}
