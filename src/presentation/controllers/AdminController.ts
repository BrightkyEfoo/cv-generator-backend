import type { Request, Response } from 'express';
import type { AdminAuthUseCase, ManageTemplatesUseCase, GetTemplatesUseCase } from '../../application/use-cases/index.js';
import type { ICVRepository } from '../../domain/interfaces/index.js';
import type { Template } from '../../domain/entities/index.js';
import type { TemplateResponseDto } from '../../application/dtos/index.js';

export class AdminController {
  constructor(
    private readonly authUseCase: AdminAuthUseCase,
    private readonly manageTemplatesUseCase: ManageTemplatesUseCase,
    private readonly getTemplatesUseCase?: GetTemplatesUseCase,
    private readonly cvRepository?: ICVRepository
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
}
