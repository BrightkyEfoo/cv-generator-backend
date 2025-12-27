import type { Request, Response } from 'express';
import type { GetTemplatesUseCase, ExportTemplatePreviewUseCase } from '../../application/use-cases/index.js';
import type { Template } from '../../domain/entities/index.js';
import type { TemplateResponseDto } from '../../application/dtos/index.js';

export class TemplateController {
  constructor(
    private readonly getTemplatesUseCase: GetTemplatesUseCase,
    private readonly exportTemplatePreviewUseCase?: ExportTemplatePreviewUseCase
  ) {}

  private toResponseDto(template: Template): TemplateResponseDto {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      previewUrl: template.previewUrl,
      category: template.category,
      features: template.features,
      defaultColors: template.defaultColors,
      availableFonts: template.availableFonts,
    };
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const templates = await this.getTemplatesUseCase.getAll();
    res.json({
      templates: templates.map(t => this.toResponseDto(t)),
      total: templates.length,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const template = await this.getTemplatesUseCase.getById(req.params.id);
    res.json(this.toResponseDto(template));
  }

  async getByCategory(req: Request, res: Response): Promise<void> {
    const category = req.params.category as Template['category'];
    const templates = await this.getTemplatesUseCase.getByCategory(category);
    res.json({
      templates: templates.map(t => this.toResponseDto(t)),
      total: templates.length,
    });
  }

  async getPreviewImage(req: Request, res: Response): Promise<void> {
    if (!this.exportTemplatePreviewUseCase) {
      res.status(501).json({ message: 'Preview generation not available' });
      return;
    }

    const image = await this.exportTemplatePreviewUseCase.generatePreviewImage(req.params.id);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(image);
  }
}
