import type { Template } from '../../../domain/entities/index.js';
import type { ITemplateRepository } from '../../../domain/interfaces/index.js';
import { NotFoundError } from '../../../shared/errors/index.js';

export class GetTemplatesUseCase {
  constructor(private readonly templateRepository: ITemplateRepository) {}

  async getAll(): Promise<Template[]> {
    return this.templateRepository.findAll();
  }

  async getById(templateId: string): Promise<Template> {
    const template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new NotFoundError('Template', templateId);
    }
    return template;
  }

  async getByCategory(category: Template['category']): Promise<Template[]> {
    return this.templateRepository.findByCategory(category);
  }
}
