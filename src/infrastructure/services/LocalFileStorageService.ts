import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type { IFileStorageService, UploadedFile } from '../../application/interfaces/index.js';
import { generateId } from '../../shared/utils/index.js';

export class LocalFileStorageService implements IFileStorageService {
  private uploadDir: string;
  private baseUrl: string;

  constructor(uploadDir: string = './uploads', baseUrl: string = '/uploads') {
    this.uploadDir = uploadDir;
    this.baseUrl = baseUrl;
    this.ensureUploadDir();
  }

  private async ensureUploadDir(): Promise<void> {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(file: Buffer, filename: string, mimetype: string): Promise<UploadedFile> {
    const id = generateId();
    const extension = filename.split('.').pop() || 'jpg';
    const storedFilename = `${id}.${extension}`;
    const filePath = join(this.uploadDir, storedFilename);

    await writeFile(filePath, file);

    return {
      id,
      url: `${this.baseUrl}/${storedFilename}`,
      filename: storedFilename,
      mimetype,
      size: file.length,
    };
  }

  async deleteFile(fileId: string): Promise<void> {
    const files = await import('fs/promises').then(fs => fs.readdir(this.uploadDir));
    const file = files.find(f => f.startsWith(fileId));
    if (file) {
      await unlink(join(this.uploadDir, file));
    }
  }

  async getFileUrl(fileId: string): Promise<string> {
    const files = await import('fs/promises').then(fs => fs.readdir(this.uploadDir));
    const file = files.find(f => f.startsWith(fileId));
    if (!file) {
      throw new Error(`File with id ${fileId} not found`);
    }
    return `${this.baseUrl}/${file}`;
  }
}
