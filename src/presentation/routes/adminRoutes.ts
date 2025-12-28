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
    '/cvs/:id',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.getCV(req, res))
  );

  router.delete(
    '/cvs/:id',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.deleteCV(req, res))
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

  // Personal CV Management (Admin's own CV with Bright OS template)
  router.get(
    '/my-cv',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.getPersonalCV(req, res))
  );

  router.post(
    '/my-cv',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.createPersonalCV(req, res))
  );

  router.patch(
    '/my-cv',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.updatePersonalCV(req, res))
  );

  router.patch(
    '/my-cv/:section',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.updatePersonalCVSection(req, res))
  );

  router.get(
    '/my-cv/download',
    requireAuth(['superadmin', 'admin']),
    asyncHandler((req, res) => controller.downloadPersonalCV(req, res))
  );

  return router;
}
