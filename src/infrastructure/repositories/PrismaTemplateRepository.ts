import type { PrismaClient, Template as PrismaTemplate } from '@prisma/client';
import type { Template, TemplateLanguage, TemplateEdgeCodes } from '../../domain/entities/index.js';
import type { ITemplateRepository } from '../../domain/interfaces/index.js';

export class PrismaTemplateRepository implements ITemplateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(prismaTemplate: PrismaTemplate): Template {
    return {
      id: prismaTemplate.id,
      name: prismaTemplate.name,
      description: prismaTemplate.description,
      previewUrl: prismaTemplate.previewUrl || '',
      category: prismaTemplate.category as Template['category'],
      edgeCodes: prismaTemplate.edgeCodes as unknown as TemplateEdgeCodes,
      defaultLanguage: prismaTemplate.defaultLanguage as TemplateLanguage,
      availableLanguages: prismaTemplate.availableLanguages as TemplateLanguage[],
      features: prismaTemplate.features as unknown as Template['features'],
      defaultColors: prismaTemplate.defaultColors as Template['defaultColors'],
      availableFonts: prismaTemplate.availableFonts,
      isActive: prismaTemplate.isActive,
    };
  }

  async findAll(): Promise<Template[]> {
    const templates = await this.prisma.template.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return templates.map(t => this.toDomain(t));
  }

  async findById(id: string): Promise<Template | null> {
    const template = await this.prisma.template.findUnique({
      where: { id },
    });
    return template && template.isActive ? this.toDomain(template) : null;
  }

  async findByCategory(category: Template['category']): Promise<Template[]> {
    const templates = await this.prisma.template.findMany({
      where: { category, isActive: true },
      orderBy: { name: 'asc' },
    });
    return templates.map(t => this.toDomain(t));
  }

  async create(template: Template): Promise<Template> {
    const created = await this.prisma.template.create({
      data: {
        id: template.id,
        name: template.name,
        description: template.description,
        previewUrl: template.previewUrl,
        category: template.category,
        edgeCodes: template.edgeCodes as object,
        defaultLanguage: template.defaultLanguage,
        availableLanguages: template.availableLanguages,
        features: template.features as object,
        defaultColors: template.defaultColors as object,
        availableFonts: template.availableFonts,
        isActive: template.isActive,
      },
    });
    return this.toDomain(created);
  }

  async update(id: string, data: Partial<Template>): Promise<Template> {
    const updated = await this.prisma.template.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.previewUrl && { previewUrl: data.previewUrl }),
        ...(data.category && { category: data.category }),
        ...(data.edgeCodes && { edgeCodes: data.edgeCodes as object }),
        ...(data.defaultLanguage && { defaultLanguage: data.defaultLanguage }),
        ...(data.availableLanguages && { availableLanguages: data.availableLanguages }),
        ...(data.features && { features: data.features as object }),
        ...(data.defaultColors && { defaultColors: data.defaultColors as object }),
        ...(data.availableFonts && { availableFonts: data.availableFonts }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return this.toDomain(updated);
  }

  async getEdgeCode(id: string, language?: TemplateLanguage): Promise<string | null> {
    const template = await this.prisma.template.findUnique({
      where: { id },
      select: { edgeCodes: true, defaultLanguage: true },
    });
    if (!template) return null;

    const edgeCodes = template.edgeCodes as TemplateEdgeCodes;
    // Return requested language, fall back to default, then to 'default' key
    if (language && edgeCodes[language]) {
      return edgeCodes[language];
    }
    return edgeCodes[template.defaultLanguage] || edgeCodes.default || null;
  }

  async deactivate(id: string): Promise<void> {
    await this.prisma.template.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
