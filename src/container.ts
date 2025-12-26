import type { PrismaClient } from '@prisma/client';
import { PrismaCVRepository, PrismaTemplateRepository, PrismaPaymentRepository, PrismaAdminRepository } from './infrastructure/repositories/index.js';
import { StripePaymentService, PuppeteerPDFService, LocalFileStorageService } from './infrastructure/services/index.js';
import { CreateCVUseCase, UpdateCVUseCase, GetCVUseCase, ExportCVUseCase, GetTemplatesUseCase, CreatePaymentUseCase, HandlePaymentWebhookUseCase, AdminAuthUseCase, ManageTemplatesUseCase } from './application/use-cases/index.js';
import { CVController, TemplateController, PaymentController, UploadController, AdminController } from './presentation/controllers/index.js';

export interface Container {
  cvController: CVController;
  templateController: TemplateController;
  paymentController: PaymentController;
  uploadController: UploadController;
  adminController: AdminController;
  adminAuthUseCase: AdminAuthUseCase;
  closePDFService: () => Promise<void>;
}

export function createContainer(prisma: PrismaClient): Container {
  const cvRepository = new PrismaCVRepository(prisma);
  const templateRepository = new PrismaTemplateRepository(prisma);
  const paymentRepository = new PrismaPaymentRepository(prisma);
  const adminRepository = new PrismaAdminRepository(prisma);

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const jwtSecret = process.env.ADMIN_JWT_SECRET || 'default-secret';

  const paymentService = new StripePaymentService(stripeSecretKey, stripeWebhookSecret);
  const pdfService = new PuppeteerPDFService(async (templateId) => {
    return templateRepository.getEdgeCode(templateId);
  });
  const fileStorageService = new LocalFileStorageService('./uploads', '/api/uploads');

  const createCVUseCase = new CreateCVUseCase(cvRepository, templateRepository);
  const updateCVUseCase = new UpdateCVUseCase(cvRepository);
  const getCVUseCase = new GetCVUseCase(cvRepository);
  const exportCVUseCase = new ExportCVUseCase(cvRepository, pdfService);
  const getTemplatesUseCase = new GetTemplatesUseCase(templateRepository);
  const createPaymentUseCase = new CreatePaymentUseCase(cvRepository, paymentRepository, paymentService);
  const handlePaymentWebhookUseCase = new HandlePaymentWebhookUseCase(cvRepository, paymentRepository, paymentService);

  const adminAuthUseCase = new AdminAuthUseCase(adminRepository, jwtSecret);
  const manageTemplatesUseCase = new ManageTemplatesUseCase(templateRepository, pdfService, './uploads');

  const cvController = new CVController(createCVUseCase, updateCVUseCase, getCVUseCase, exportCVUseCase);
  const templateController = new TemplateController(getTemplatesUseCase);
  const paymentController = new PaymentController(createPaymentUseCase, handlePaymentWebhookUseCase);
  const uploadController = new UploadController(fileStorageService);
  const adminController = new AdminController(adminAuthUseCase, manageTemplatesUseCase);

  return {
    cvController,
    templateController,
    paymentController,
    uploadController,
    adminController,
    adminAuthUseCase,
    closePDFService: () => pdfService.closeBrowser(),
  };
}
