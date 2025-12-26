import type { PrismaClient, Template as PrismaTemplate } from '@prisma/client';
import type { Template } from '../../domain/entities/index.js';
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

  async create(template: Template & { edgeCode: string }): Promise<Template> {
    const created = await this.prisma.template.create({
      data: {
        id: template.id,
        name: template.name,
        description: template.description,
        previewUrl: template.previewUrl,
        category: template.category,
        edgeCode: template.edgeCode,
        features: template.features as object,
        defaultColors: template.defaultColors as object,
        availableFonts: template.availableFonts,
        isActive: template.isActive,
      },
    });
    return this.toDomain(created);
  }

  async update(id: string, data: Partial<Template & { edgeCode: string }>): Promise<Template> {
    const updated = await this.prisma.template.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.previewUrl && { previewUrl: data.previewUrl }),
        ...(data.category && { category: data.category }),
        ...(data.edgeCode && { edgeCode: data.edgeCode }),
        ...(data.features && { features: data.features as object }),
        ...(data.defaultColors && { defaultColors: data.defaultColors as object }),
        ...(data.availableFonts && { availableFonts: data.availableFonts }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return this.toDomain(updated);
  }

  async getEdgeCode(id: string): Promise<string | null> {
    const template = await this.prisma.template.findUnique({
      where: { id },
      select: { edgeCode: true },
    });
    return template?.edgeCode || null;
  }

  async deactivate(id: string): Promise<void> {
    await this.prisma.template.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
