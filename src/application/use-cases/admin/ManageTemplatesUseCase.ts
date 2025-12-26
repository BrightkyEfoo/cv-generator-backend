import type { Template, CV } from '../../../domain/entities/index.js';
import type { CreateTemplateDto, UpdateTemplateDto } from '../../dtos/index.js';
import type { PrismaTemplateRepository } from '../../../infrastructure/repositories/PrismaTemplateRepository.js';
import type { PuppeteerPDFService } from '../../../infrastructure/services/PuppeteerPDFService.js';
import { generateId } from '../../../shared/utils/index.js';
import { NotFoundError } from '../../../shared/errors/index.js';

export class ManageTemplatesUseCase {
  constructor(
    private readonly templateRepository: PrismaTemplateRepository,
    private readonly pdfService: PuppeteerPDFService,
    private readonly previewOutputDir: string
  ) {}

  async create(dto: CreateTemplateDto, adminId: string): Promise<Template> {
    const templateId = generateId();

    const template = await this.templateRepository.create({
      id: templateId,
      name: dto.name,
      description: dto.description,
      previewUrl: '',
      category: dto.category,
      features: dto.features,
      defaultColors: dto.defaultColors,
      availableFonts: dto.availableFonts,
      isActive: true,
      edgeCode: dto.edgeCode,
    });

    const previewUrl = await this.generatePreview(templateId, dto.edgeCode, dto.defaultColors);
    await this.templateRepository.update(templateId, { previewUrl });

    return { ...template, previewUrl };
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<Template> {
    const existing = await this.templateRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Template', id);
    }

    const updated = await this.templateRepository.update(id, {
      ...dto,
      features: dto.features ? { ...existing.features, ...dto.features } : undefined,
      defaultColors: dto.defaultColors ? { ...existing.defaultColors, ...dto.defaultColors } : undefined,
    });

    if (dto.edgeCode || dto.defaultColors) {
      const edgeCode = dto.edgeCode || await this.templateRepository.getEdgeCode(id) || '';
      const colors = dto.defaultColors
        ? { ...existing.defaultColors, ...dto.defaultColors }
        : existing.defaultColors;

      const previewUrl = await this.generatePreview(id, edgeCode, colors);
      await this.templateRepository.update(id, { previewUrl });
      return { ...updated, previewUrl };
    }

    return updated;
  }

  async deactivate(id: string): Promise<void> {
    const existing = await this.templateRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Template', id);
    }
    await this.templateRepository.deactivate(id);
  }

  async regeneratePreview(id: string): Promise<string> {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new NotFoundError('Template', id);
    }

    const edgeCode = await this.templateRepository.getEdgeCode(id) || '';
    const previewUrl = await this.generatePreview(id, edgeCode, template.defaultColors);
    await this.templateRepository.update(id, { previewUrl });

    return previewUrl;
  }

  private async generatePreview(
    templateId: string,
    edgeCode: string,
    colors: { primary: string; secondary: string }
  ): Promise<string> {
    const mockCV = this.createMockCV(templateId, colors);
    const outputPath = `${this.previewOutputDir}/template-${templateId}.png`;

    await this.pdfService.generateTemplatePreview(edgeCode, mockCV, outputPath);

    return `/uploads/template-${templateId}.png`;
  }

  private createMockCV(templateId: string, colors: { primary: string; secondary: string }): CV {
    return {
      id: 'mock-cv',
      sessionId: 'mock-session',
      title: 'Sample CV',
      personalInfo: {
        firstName: 'Jean',
        lastName: 'Dupont',
        title: 'Senior Software Engineer',
        email: 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        city: 'Paris',
        country: 'France',
        socialLinks: [
          { platform: 'linkedin', url: 'https://linkedin.com/in/jeandupont', label: 'LinkedIn' },
          { platform: 'github', url: 'https://github.com/jeandupont', label: 'GitHub' },
        ],
      },
      summary: 'Experienced software engineer with 8+ years of expertise in building scalable web applications. Passionate about clean code, best practices, and mentoring junior developers.',
      experiences: [
        {
          id: '1',
          jobTitle: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'Paris, France',
          startDate: '2020-01',
          current: true,
          description: 'Led development of microservices architecture serving 1M+ users. Mentored team of 5 developers.',
          achievements: ['Reduced API response time by 40%', 'Implemented CI/CD pipeline'],
        },
        {
          id: '2',
          jobTitle: 'Software Engineer',
          company: 'StartupXYZ',
          location: 'Lyon, France',
          startDate: '2017-03',
          endDate: '2019-12',
          current: false,
          description: 'Full-stack development using React and Node.js. Built core product features.',
          achievements: ['Shipped 3 major product releases'],
        },
      ],
      education: [
        {
          id: '1',
          degree: 'Master',
          field: 'Computer Science',
          institution: 'Ecole Polytechnique',
          startDate: '2013',
          endDate: '2015',
          current: false,
        },
      ],
      skills: [
        { id: '1', name: 'TypeScript', level: 'expert', category: 'Languages' },
        { id: '2', name: 'React', level: 'expert', category: 'Frontend' },
        { id: '3', name: 'Node.js', level: 'advanced', category: 'Backend' },
        { id: '4', name: 'PostgreSQL', level: 'advanced', category: 'Databases' },
        { id: '5', name: 'Docker', level: 'intermediate', category: 'DevOps' },
      ],
      languages: [
        { id: '1', name: 'French', proficiency: 'native' },
        { id: '2', name: 'English', proficiency: 'fluent' },
      ],
      certifications: [
        { id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon', issueDate: '2022-05' },
      ],
      projects: [],
      publications: [],
      awards: [],
      volunteer: [],
      interests: [],
      references: [],
      customSections: [],
      customization: {
        templateId,
        colors: {
          primary: colors.primary,
          secondary: colors.secondary,
          text: '#333333',
          headings: '#1a1a1a',
          background: '#ffffff',
          dividers: '#e5e5e5',
        },
        typography: {
          headingFont: 'Helvetica',
          bodyFont: 'Helvetica',
          headingSize: 16,
          bodySize: 11,
          lineHeight: 1.4,
          letterSpacing: 0,
        },
        spacing: {
          margins: { top: 40, right: 40, bottom: 40, left: 40 },
          sectionGap: 20,
          itemGap: 10,
        },
        layout: {
          sections: [],
          sidebarSections: [],
          hasSidebar: false,
          sidebarPosition: 'right',
          headerStyle: 'centered',
          dateFormat: 'MMM YYYY',
          showPageNumbers: true,
        },
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      },
      isPaid: false,
    };
  }
}
