import { Router } from 'express';
import type { PaymentController } from '../controllers/index.js';
import { asyncHandler } from '../middleware/index.js';

export function createPaymentRoutes(controller: PaymentController): Router {
  const router = Router();

  router.post('/cv/:cvId/intent', asyncHandler((req, res) => controller.createPaymentIntent(req, res)));

  return router;
}

export function createWebhookRoutes(controller: PaymentController): Router {
  const router = Router();

  router.post('/stripe', asyncHandler((req, res) => controller.handleWebhook(req, res)));

  return router;
}
