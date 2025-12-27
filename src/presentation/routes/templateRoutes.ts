import { Router } from 'express';
import type { TemplateController } from '../controllers/index.js';
import { asyncHandler } from '../middleware/index.js';

export function createTemplateRoutes(controller: TemplateController): Router {
  const router = Router();

  router.get('/', asyncHandler((req, res) => controller.getAll(req, res)));
  router.get('/category/:category', asyncHandler((req, res) => controller.getByCategory(req, res)));

  // Specific routes must come before :id to avoid being caught by the catch-all
  router.get('/:id/preview-image', asyncHandler((req, res) => controller.getPreviewImage(req, res)));

  router.get('/:id', asyncHandler((req, res) => controller.getById(req, res)));

  return router;
}
