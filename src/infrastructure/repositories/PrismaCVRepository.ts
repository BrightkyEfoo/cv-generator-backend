import type { PrismaClient, CV as PrismaCV } from '@prisma/client';
import type { CV, TemplateLanguage } from '../../domain/entities/index.js';
import type { ICVRepository } from '../../domain/interfaces/index.js';

export class PrismaCVRepository implements ICVRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(prismaCV: PrismaCV): CV {
    return {
      id: prismaCV.id,
      sessionId: prismaCV.sessionId,
      title: prismaCV.title,
      templateLanguage: prismaCV.templateLanguage as TemplateLanguage,
      personalInfo: prismaCV.personalInfo as unknown as CV['personalInfo'],
      summary: prismaCV.summary || undefined,
      objective: prismaCV.objective || undefined,
      experiences: prismaCV.experiences as unknown as CV['experiences'],
      education: prismaCV.education as unknown as CV['education'],
      skills: prismaCV.skills as unknown as CV['skills'],
      languages: prismaCV.languages as unknown as CV['languages'],
      certifications: prismaCV.certifications as unknown as CV['certifications'],
      projects: prismaCV.projects as unknown as CV['projects'],
      publications: prismaCV.publications as unknown as CV['publications'],
      awards: prismaCV.awards as unknown as CV['awards'],
      volunteer: prismaCV.volunteer as unknown as CV['volunteer'],
      interests: prismaCV.interests as unknown as CV['interests'],
      references: prismaCV.references as unknown as CV['references'],
      customSections: prismaCV.customSections as unknown as CV['customSections'],
      customization: prismaCV.customization as unknown as CV['customization'],
      metadata: {
        createdAt: prismaCV.createdAt,
        updatedAt: prismaCV.updatedAt,
        version: prismaCV.version,
        lastExportedAt: prismaCV.lastExportedAt || undefined,
      },
      isPaid: prismaCV.isPaid,
      paymentId: undefined,
    };
  }

  async create(cv: CV): Promise<CV> {
    const created = await this.prisma.cV.create({
      data: {
        id: cv.id,
        sessionId: cv.sessionId,
        title: cv.title,
        templateLanguage: cv.templateLanguage,
        personalInfo: cv.personalInfo as object,
        summary: cv.summary,
        objective: cv.objective,
        experiences: cv.experiences as object[],
        education: cv.education as object[],
        skills: cv.skills as object[],
        languages: cv.languages as object[],
        certifications: cv.certifications as object[],
        projects: cv.projects as object[],
        publications: cv.publications as object[],
        awards: cv.awards as object[],
        volunteer: cv.volunteer as object[],
        interests: cv.interests as object[],
        references: cv.references as object[],
        customSections: cv.customSections as object[],
        customization: cv.customization as object,
        templateId: cv.customization.templateId,
        isPaid: cv.isPaid,
        version: cv.metadata.version,
      },
    });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<CV | null> {
    const cv = await this.prisma.cV.findUnique({ where: { id } });
    return cv ? this.toDomain(cv) : null;
  }

  async findBySessionId(sessionId: string): Promise<CV | null> {
    const cv = await this.prisma.cV.findFirst({
      where: { sessionId },
      orderBy: { updatedAt: 'desc' },
    });
    return cv ? this.toDomain(cv) : null;
  }

  async update(cv: CV): Promise<CV> {
    const updated = await this.prisma.cV.update({
      where: { id: cv.id },
      data: {
        title: cv.title,
        templateLanguage: cv.templateLanguage,
        personalInfo: cv.personalInfo as object,
        summary: cv.summary,
        objective: cv.objective,
        experiences: cv.experiences as object[],
        education: cv.education as object[],
        skills: cv.skills as object[],
        languages: cv.languages as object[],
        certifications: cv.certifications as object[],
        projects: cv.projects as object[],
        publications: cv.publications as object[],
        awards: cv.awards as object[],
        volunteer: cv.volunteer as object[],
        interests: cv.interests as object[],
        references: cv.references as object[],
        customSections: cv.customSections as object[],
        customization: cv.customization as object,
        templateId: cv.customization.templateId,
        isPaid: cv.isPaid,
        version: cv.metadata.version,
        lastExportedAt: cv.metadata.lastExportedAt,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cV.delete({ where: { id } });
  }

  async markAsPaid(id: string): Promise<CV> {
    const updated = await this.prisma.cV.update({
      where: { id },
      data: { isPaid: true },
    });
    return this.toDomain(updated);
  }
}
