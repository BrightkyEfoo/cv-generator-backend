import type { CV } from '../../domain/entities/index.js';

export interface PDFGenerationOptions {
  watermark?: boolean;
  quality: 'preview' | 'full';
}

export interface IPDFService {
  generatePreview(cv: CV): Promise<Buffer>;
  generateFull(cv: CV): Promise<Buffer>;
  generateWithWatermark(cv: CV): Promise<Buffer>;
  generatePreviewImage(cv: CV): Promise<Buffer>;
  generatePreviewImages(cv: CV): Promise<Buffer[]>;
}
