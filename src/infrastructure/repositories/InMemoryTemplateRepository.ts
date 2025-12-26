import type { Template } from '../../domain/entities/index.js';
import type { ITemplateRepository } from '../../domain/interfaces/index.js';
import { store } from '../persistence/InMemoryStore.js';

// Store edge codes separately since Template entity doesn't include edgeCode
const edgeCodes = new Map<string, string>();

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

  async getEdgeCode(id: string): Promise<string | null> {
    return edgeCodes.get(id) || null;
  }

  async update(id: string, data: Partial<Template & { edgeCode: string }>): Promise<Template> {
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
      ...(data.features && { features: data.features }),
      ...(data.defaultColors && { defaultColors: data.defaultColors }),
      ...(data.availableFonts && { availableFonts: data.availableFonts }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    };

    if (data.edgeCode) {
      edgeCodes.set(id, data.edgeCode);
    }

    store.getTemplates().set(id, updated);
    return updated;
  }

  seedTemplates(templates: (Template & { edgeCode?: string })[]): void {
    for (const template of templates) {
      const { edgeCode, ...templateData } = template;
      store.getTemplates().set(template.id, templateData);
      if (edgeCode) {
        edgeCodes.set(template.id, edgeCode);
      }
    }
  }
}
