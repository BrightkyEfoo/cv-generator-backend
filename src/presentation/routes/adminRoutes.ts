import { Router } from 'express';
import type { AdminController } from '../controllers/index.js';
import type { AdminAuthUseCase } from '../../application/use-cases/index.js';
import { asyncHandler, createAdminAuthMiddleware } from '../middleware/index.js';

export function createAdminRoutes(
  controller: AdminController,
  authUseCase: AdminAuthUseCase
): Router {
  const router = Router();
  const requireAuth = createAdminAuthMiddleware(authUseCase);

  router.post('/login', asyncHandler((req, res) => controller.login(req, res)));

  router.post(
    '/templates',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.createTemplate(req, res))
  );

  router.patch(
    '/templates/:id',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.updateTemplate(req, res))
  );

  router.delete(
    '/templates/:id',
    requireAuth(['superadmin']),
    asyncHandler((req, res) => controller.deactivateTemplate(req, res))
  );

  router.post(
    '/templates/:id/regenerate-preview',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.regeneratePreview(req, res))
  );

  router.get(
    '/templates',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.listTemplates(req, res))
  );

  router.get(
    '/cvs',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.listCVs(req, res))
  );

  router.get(
    '/settings',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.getSettings(req, res))
  );

  router.patch(
    '/settings',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.updateSettings(req, res))
  );

  return router;
}
