import type { Template } from '../../domain/entities/index.js';
import type { ITemplateRepository } from '../../domain/interfaces/index.js';
import { store } from '../persistence/InMemoryStore.js';

export class InMemoryTemplateRepository implements ITemplateRepository {
  async findAll(): Promise<Template[]> {
    return Array.from(store.getTemplates().values()).filter(t => t.isActive);
  }

  async findById(id: string): Promise<Template | null> {
    const template = store.getTemplates().get(id);
    return template && template.isActive ? template : null;
  }

  async findByCategory(category: Template['category']): Promise<Template[]> {
    return Array.from(store.getTemplates().values()).filter(
      t => t.isActive && t.category === category
    );
  }

  seedTemplates(templates: Template[]): void {
    for (const template of templates) {
      store.getTemplates().set(template.id, template);
    }
  }
}
