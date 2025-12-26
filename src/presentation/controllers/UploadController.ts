import type { Request, Response } from 'express';
import type { IFileStorageService } from '../../application/interfaces/index.js';
import { ValidationError } from '../../shared/errors/index.js';

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export class UploadController {
  constructor(private readonly fileStorageService: IFileStorageService) {}

  async uploadImage(req: Request, res: Response): Promise<void> {
    const file = req.file;

    if (!file) {
      throw new ValidationError('No file uploaded');
    }

    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new ValidationError('Invalid file type. Allowed: JPEG, PNG, WebP');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError('File too large. Maximum size: 5MB');
    }

    const uploaded = await this.fileStorageService.uploadImage(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    res.json(uploaded);
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    await this.fileStorageService.deleteFile(req.params.id);
    res.status(204).send();
  }
}
