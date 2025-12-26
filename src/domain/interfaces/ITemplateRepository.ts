import type { Template } from '../entities/index.js';

export interface ITemplateRepository {
  findAll(): Promise<Template[]>;
  findById(id: string): Promise<Template | null>;
  findByCategory(category: Template['category']): Promise<Template[]>;
}
