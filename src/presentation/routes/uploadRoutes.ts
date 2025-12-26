import { Router } from 'express';
import multer from 'multer';
import type { UploadController } from '../controllers/index.js';
import { asyncHandler } from '../middleware/index.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export function createUploadRoutes(controller: UploadController): Router {
  const router = Router();

  router.post('/image', upload.single('image'), asyncHandler((req, res) => controller.uploadImage(req, res)));
  router.delete('/image/:id', asyncHandler((req, res) => controller.deleteImage(req, res)));

  return router;
}
