import type { Template, TemplateLanguage } from '../entities/index.js';

export interface ITemplateRepository {
  findAll(): Promise<Template[]>;
  findById(id: string): Promise<Template | null>;
  findByCategory(category: Template['category']): Promise<Template[]>;
  getEdgeCode(id: string, language?: TemplateLanguage): Promise<string | null>;
  update(id: string, data: Partial<Template>): Promise<Template>;
}
