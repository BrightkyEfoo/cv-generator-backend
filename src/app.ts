import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import type { PrismaClient } from '@prisma/client';
import { createContainer, type Container } from './container.js';
import { createCVRoutes, createTemplateRoutes, createPaymentRoutes, createWebhookRoutes, createUploadRoutes, createAdminRoutes } from './presentation/routes/index.js';
import { errorHandler, sessionHandler, apiKeyHandler } from './presentation/middleware/index.js';

export function createApp(prisma: PrismaClient): { app: express.Application; container: Container } {
  const app = express();
  const container = createContainer(prisma);

  // CORS must be before helmet to handle preflight requests
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-Key', 'X-Session-Id', 'Authorization'],
    exposedHeaders: ['X-Session-Id'],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }));

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:', '*'],
        fontSrc: ["'self'", 'data:'],
        frameAncestors: ['*'], // Allow embedding in any iframe
      },
    },
    frameguard: false, // Disable X-Frame-Options header to allow framing
  }));
  app.use(compression());

  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }),
    (req, res, next) => createWebhookRoutes(container.paymentController)(req, res, next));

  app.use(express.json());
  app.use(apiKeyHandler);
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
