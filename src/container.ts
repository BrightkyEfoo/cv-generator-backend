import type { PrismaClient } from '@prisma/client';
import { PrismaCVRepository, PrismaTemplateRepository, PrismaPaymentRepository, PrismaAdminRepository, PrismaAppSettingsRepository } from './infrastructure/repositories/index.js';
import { StripePaymentService, PuppeteerPDFService, LocalFileStorageService, TemplatePreviewGenerator } from './infrastructure/services/index.js';
import { CreateCVUseCase, UpdateCVUseCase, GetCVUseCase, ExportCVUseCase, GetTemplatesUseCase, ExportTemplatePreviewUseCase, CreatePaymentUseCase, HandlePaymentWebhookUseCase, AdminAuthUseCase, ManageTemplatesUseCase, ManageSettingsUseCase } from './application/use-cases/index.js';
import { CVController, TemplateController, PaymentController, UploadController, AdminController } from './presentation/controllers/index.js';

export interface Container {
  cvController: CVController;
  templateController: TemplateController;
  paymentController: PaymentController;
  uploadController: UploadController;
  adminController: AdminController;
  adminAuthUseCase: AdminAuthUseCase;
  appSettingsRepository: PrismaAppSettingsRepository;
  closePDFService: () => Promise<void>;
  closePreviewGenerator: () => Promise<void>;
}

export function createContainer(prisma: PrismaClient): Container {
  const cvRepository = new PrismaCVRepository(prisma);
  const templateRepository = new PrismaTemplateRepository(prisma);
  const paymentRepository = new PrismaPaymentRepository(prisma);
  const adminRepository = new PrismaAdminRepository(prisma);
  const appSettingsRepository = new PrismaAppSettingsRepository(prisma);

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const jwtSecret = process.env.ADMIN_JWT_SECRET || 'default-secret';

  const paymentService = new StripePaymentService(stripeSecretKey, stripeWebhookSecret);
  const pdfService = new PuppeteerPDFService(async (templateId, language) => {
    return templateRepository.getEdgeCode(templateId, language);
  });
  const fileStorageService = new LocalFileStorageService('./uploads', '/api/uploads');
  const previewGenerator = new TemplatePreviewGenerator('./public/previews');

  const createCVUseCase = new CreateCVUseCase(cvRepository, templateRepository, previewGenerator);
  const updateCVUseCase = new UpdateCVUseCase(cvRepository);
  const getCVUseCase = new GetCVUseCase(cvRepository, templateRepository, previewGenerator);
  const exportCVUseCase = new ExportCVUseCase(cvRepository, pdfService, appSettingsRepository);
  const getTemplatesUseCase = new GetTemplatesUseCase(templateRepository);
  const exportTemplatePreviewUseCase = new ExportTemplatePreviewUseCase(templateRepository, previewGenerator);
  const createPaymentUseCase = new CreatePaymentUseCase(cvRepository, paymentRepository, paymentService);
  const handlePaymentWebhookUseCase = new HandlePaymentWebhookUseCase(cvRepository, paymentRepository, paymentService);

  const adminAuthUseCase = new AdminAuthUseCase(adminRepository, jwtSecret);
  const manageTemplatesUseCase = new ManageTemplatesUseCase(templateRepository, pdfService, './uploads');
  const manageSettingsUseCase = new ManageSettingsUseCase(appSettingsRepository);

  const cvController = new CVController(createCVUseCase, updateCVUseCase, getCVUseCase, exportCVUseCase);
  const templateController = new TemplateController(getTemplatesUseCase, exportTemplatePreviewUseCase);
  const paymentController = new PaymentController(createPaymentUseCase, handlePaymentWebhookUseCase);
  const uploadController = new UploadController(fileStorageService);
  const adminController = new AdminController(adminAuthUseCase, manageTemplatesUseCase, getTemplatesUseCase, cvRepository, manageSettingsUseCase);

  return {
    cvController,
    templateController,
    paymentController,
    uploadController,
    adminController,
    adminAuthUseCase,
    appSettingsRepository,
    closePDFService: () => pdfService.closeBrowser(),
    closePreviewGenerator: () => previewGenerator.closeBrowser(),
  };
}
