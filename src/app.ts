import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import type { PrismaClient } from '@prisma/client';
import { createContainer, type Container } from './container.js';
import { createCVRoutes, createTemplateRoutes, createPaymentRoutes, createWebhookRoutes, createUploadRoutes, createAdminRoutes } from './presentation/routes/index.js';
import { errorHandler, sessionHandler } from './presentation/middleware/index.js';

export function createApp(prisma: PrismaClient): { app: express.Application; container: Container } {
  const app = express();
  const container = createContainer(prisma);

  app.use(helmet());
  app.use(compression());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['X-Session-Id'],
  }));

  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }),
    (req, res, next) => createWebhookRoutes(container.paymentController)(req, res, next));

  app.use(express.json());
  app.use(sessionHandler);

  app.use('/api/cv', createCVRoutes(container.cvController));
  app.use('/api/templates', createTemplateRoutes(container.templateController));
  app.use('/api/payments', createPaymentRoutes(container.paymentController));
  app.use('/api/uploads', createUploadRoutes(container.uploadController));
  app.use('/api/admin', createAdminRoutes(container.adminController, container.adminAuthUseCase));

  app.use('/uploads', express.static('uploads'));
  app.use('/previews', express.static('public/previews'));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(errorHandler);

  return { app, container };
}
