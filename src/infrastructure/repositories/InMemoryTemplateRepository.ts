import type { Template, TemplateLanguage } from '../../domain/entities/index.js';
import type { ITemplateRepository } from '../../domain/interfaces/index.js';
import { store } from '../persistence/InMemoryStore.js';

export class InMemoryTemplateRepository implements ITemplateRepository {
  async findAll(): Promise<Template[]> {
    return Array.from(store.getTemplates().values()).filter(t => t.isActive);
  }

  async findAllWithEdgeCodes(): Promise<Template[]> {
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

  async getEdgeCode(id: string, language?: TemplateLanguage): Promise<string | null> {
    const template = store.getTemplates().get(id);
    if (!template) return null;

    // Return requested language, fall back to default, then to 'default' key
    if (language && template.edgeCodes[language]) {
      return template.edgeCodes[language];
    }
    return template.edgeCodes[template.defaultLanguage] || template.edgeCodes.default || null;
  }

  async update(id: string, data: Partial<Template>): Promise<Template> {
    const existing = store.getTemplates().get(id);
    if (!existing) {
      throw new Error(`Template not found: ${id}`);
    }

    const updated: Template = {
      ...existing,
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.previewUrl && { previewUrl: data.previewUrl }),
      ...(data.category && { category: data.category }),
      ...(data.edgeCodes && { edgeCodes: data.edgeCodes }),
      ...(data.defaultLanguage && { defaultLanguage: data.defaultLanguage }),
      ...(data.availableLanguages && { availableLanguages: data.availableLanguages }),
      ...(data.features && { features: data.features }),
      ...(data.defaultColors && { defaultColors: data.defaultColors }),
      ...(data.availableFonts && { availableFonts: data.availableFonts }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    };

    store.getTemplates().set(id, updated);
    return updated;
  }

  seedTemplates(templates: Template[]): void {
    for (const template of templates) {
      store.getTemplates().set(template.id, template);
    }
  }
}
