import type { Request, Response } from 'express';
import type { AdminAuthUseCase, ManageTemplatesUseCase, GetTemplatesUseCase, ManageSettingsUseCase, ManagePersonalCVUseCase, ExportCVUseCase } from '../../application/use-cases/index.js';
import type { ICVRepository } from '../../domain/interfaces/index.js';
import type { Template } from '../../domain/entities/index.js';
import type { TemplateResponseDto } from '../../application/dtos/index.js';

export class AdminController {
  constructor(
    private readonly authUseCase: AdminAuthUseCase,
    private readonly manageTemplatesUseCase: ManageTemplatesUseCase,
    private readonly getTemplatesUseCase?: GetTemplatesUseCase,
    private readonly cvRepository?: ICVRepository,
    private readonly manageSettingsUseCase?: ManageSettingsUseCase,
    private readonly managePersonalCVUseCase?: ManagePersonalCVUseCase,
    private readonly exportCVUseCase?: ExportCVUseCase
  ) {}

  private toTemplateDto(template: Template): TemplateResponseDto {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      previewUrl: template.previewUrl,
      category: template.category,
      defaultLanguage: template.defaultLanguage,
      availableLanguages: template.availableLanguages,
      features: template.features,
      defaultColors: template.defaultColors,
      availableFonts: template.availableFonts,
    };
  }

  async login(req: Request, res: Response): Promise<void> {
    const result = await this.authUseCase.login({
      email: req.body.email,
      password: req.body.password,
    });
    res.json(result);
  }

  async createTemplate(req: Request, res: Response): Promise<void> {
    const adminId = (req as Request & { adminId: string }).adminId;
    const template = await this.manageTemplatesUseCase.create(req.body, adminId);
    res.status(201).json(this.toTemplateDto(template));
  }

  async updateTemplate(req: Request, res: Response): Promise<void> {
    const template = await this.manageTemplatesUseCase.update(req.params.id, req.body);
    res.json(this.toTemplateDto(template));
  }

  async deactivateTemplate(req: Request, res: Response): Promise<void> {
    await this.manageTemplatesUseCase.deactivate(req.params.id);
    res.status(204).send();
  }

  async regeneratePreview(req: Request, res: Response): Promise<void> {
    const previewUrl = await this.manageTemplatesUseCase.regeneratePreview(req.params.id);
    res.json({ previewUrl });
  }

  async listTemplates(req: Request, res: Response): Promise<void> {
    if (!this.getTemplatesUseCase) {
      res.status(500).json({ error: 'Templates use case not configured' });
      return;
    }
    const templates = await this.getTemplatesUseCase.getAllWithEdgeCodes();
    res.json(templates);
  }

  async listCVs(req: Request, res: Response): Promise<void> {
    if (!this.cvRepository) {
      res.status(500).json({ error: 'CV repository not configured' });
      return;
    }
    const cvs = await this.cvRepository.findAll();
    res.json(cvs);
  }

  async getSettings(req: Request, res: Response): Promise<void> {
    if (!this.manageSettingsUseCase) {
      res.status(500).json({ error: 'Settings use case not configured' });
      return;
    }
    const settings = await this.manageSettingsUseCase.getSettings();
    res.json(settings);
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    if (!this.manageSettingsUseCase) {
      res.status(500).json({ error: 'Settings use case not configured' });
      return;
    }
    const adminId = (req as Request & { adminId: string }).adminId;
    const settings = await this.manageSettingsUseCase.updateSettings(req.body, adminId);
    res.json(settings);
  }

  // Personal CV Management
  async getPersonalCV(req: Request, res: Response): Promise<void> {
    if (!this.managePersonalCVUseCase) {
      res.status(500).json({ error: 'Personal CV use case not configured' });
      return;
    }
    let cv = await this.managePersonalCVUseCase.getPersonalCV();
    if (!cv) {
      // Auto-create the personal CV if it doesn't exist
      cv = await this.managePersonalCVUseCase.createOrUpdatePersonalCV();
    }
    res.json(cv);
  }

  async createPersonalCV(req: Request, res: Response): Promise<void> {
    if (!this.managePersonalCVUseCase) {
      res.status(500).json({ error: 'Personal CV use case not configured' });
      return;
    }
    const cv = await this.managePersonalCVUseCase.createOrUpdatePersonalCV(req.body);
    res.status(201).json(cv);
  }

  async updatePersonalCV(req: Request, res: Response): Promise<void> {
    if (!this.managePersonalCVUseCase) {
      res.status(500).json({ error: 'Personal CV use case not configured' });
      return;
    }
    const cv = await this.managePersonalCVUseCase.createOrUpdatePersonalCV(req.body);
    res.json(cv);
  }

  async updatePersonalCVSection(req: Request, res: Response): Promise<void> {
    if (!this.managePersonalCVUseCase) {
      res.status(500).json({ error: 'Personal CV use case not configured' });
      return;
    }
    const section = req.params.section;
    const validSections = ['personalInfo', 'summary', 'objective', 'experiences', 'education', 'skills', 'languages', 'certifications', 'projects', 'publications', 'awards', 'volunteer', 'interests', 'references', 'customSections', 'customization'];
    if (!validSections.includes(section)) {
      res.status(400).json({ error: `Invalid section: ${section}` });
      return;
    }
    const cv = await this.managePersonalCVUseCase.updateSection(section as keyof import('../../domain/entities/index.js').CV, req.body);
    res.json(cv);
  }

  async downloadPersonalCV(req: Request, res: Response): Promise<void> {
    if (!this.managePersonalCVUseCase || !this.exportCVUseCase) {
      res.status(500).json({ error: 'Personal CV or Export use case not configured' });
      return;
    }

    let cv = await this.managePersonalCVUseCase.getPersonalCV();
    if (!cv) {
      cv = await this.managePersonalCVUseCase.createOrUpdatePersonalCV();
    }

    const format = (req.query.format as string) || 'pdf';
    const result = await this.exportCVUseCase.execute({
      cvId: cv.id,
      format: format as 'pdf' | 'png',
      skipPaymentCheck: true, // Admin can always download
    });

    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="CV-Brightman-EFOO.pdf"`);
    } else {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="CV-Brightman-EFOO.png"`);
    }

    res.send(result.data);
  }
}
