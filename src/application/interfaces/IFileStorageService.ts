export interface UploadedFile {
  id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface IFileStorageService {
  uploadImage(file: Buffer, filename: string, mimetype: string): Promise<UploadedFile>;
  deleteFile(fileId: string): Promise<void>;
  getFileUrl(fileId: string): Promise<string>;
}
