import { Router } from 'express';
import type { IAppSettingsRepository } from '../../domain/interfaces/index.js';
import { asyncHandler } from '../middleware/index.js';

export function createSettingsRoutes(settingsRepository: IAppSettingsRepository): Router {
  const router = Router();

  // Public endpoint to get public settings (no auth required)
  router.get('/public', asyncHandler(async (_req, res) => {
    const settings = await settingsRepository.get();
    res.json({
      freeDownloads: settings.freeDownloads,
    });
  }));

  return router;
}
