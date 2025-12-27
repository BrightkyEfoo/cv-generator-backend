import type { CV } from '../../../domain/entities/index.js';
import type { ICVRepository, ITemplateRepository, ITemplatePreviewGenerator } from '../../../domain/interfaces/index.js';
import type { CreateCVDto } from '../../dtos/index.js';
import { NotFoundError } from '../../../shared/errors/index.js';
import { generateCvId } from '../../../shared/utils/index.js';

export class CreateCVUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly templateRepository: ITemplateRepository,
    private readonly previewGenerator?: ITemplatePreviewGenerator
  ) {}

  async execute(dto: CreateCVDto): Promise<CV> {
    const template = await this.templateRepository.findById(dto.templateId);
    if (!template) {
      throw new NotFoundError('Template', dto.templateId);
    }

    // Generate template preview if missing (don't await to avoid blocking)
    this.ensureTemplatePreview(dto.templateId, template).catch((err) => {
      console.error('Background preview generation failed:', err);
    });

    const now = new Date();
    const cv: CV = {
      id: generateCvId(),
      sessionId: dto.sessionId,
      title: dto.title,
      templateLanguage: dto.templateLanguage || template.defaultLanguage,
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        socialLinks: [],
      },
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
      publications: [],
      awards: [],
      volunteer: [],
      interests: [],
      references: [],
      customSections: [],
      customization: {
        templateId: template.id,
        colors: {
          primary: template.defaultColors.primary,
          secondary: template.defaultColors.secondary,
          text: '#333333',
          headings: '#1a1a1a',
          background: '#ffffff',
          dividers: '#e5e5e5',
        },
        typography: {
          headingFont: template.availableFonts[0] || 'Helvetica',
          bodyFont: template.availableFonts[0] || 'Helvetica',
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
          sections: [
            { type: 'personal', title: 'Personal Information', isVisible: true, order: 0, showIcon: true },
            { type: 'summary', title: 'Professional Summary', isVisible: true, order: 1, showIcon: true },
            { type: 'experience', title: 'Work Experience', isVisible: true, order: 2, showIcon: true },
            { type: 'education', title: 'Education', isVisible: true, order: 3, showIcon: true },
            { type: 'skills', title: 'Skills', isVisible: true, order: 4, showIcon: true, columns: 2 },
          ],
          sidebarSections: [
            { type: 'languages', title: 'Languages', isVisible: true, order: 0, showIcon: true },
            { type: 'certifications', title: 'Certifications', isVisible: true, order: 1, showIcon: true },
          ],
          hasSidebar: template.features.hasSidebar,
          sidebarPosition: 'right',
          headerStyle: 'centered',
          dateFormat: 'MMM YYYY',
          showPageNumbers: true,
        },
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        version: 1,
      },
      isPaid: false,
    };

    return this.cvRepository.create(cv);
  }

  private async ensureTemplatePreview(
    templateId: string,
    template: { previewUrl?: string; defaultColors: Record<string, string> }
  ): Promise<void> {
    // Skip if preview generator not available or template already has preview
    if (!this.previewGenerator || template.previewUrl) {
      return;
    }

    try {
      // Get edge code for the template
      const edgeCode = await this.templateRepository.getEdgeCode(templateId);
      if (!edgeCode) {
        console.warn(`No edge code found for template: ${templateId}`);
        return;
      }

      // Extract template name from ID (e.g., "template-corporate-red" -> "corporate-red")
      const templateName = templateId.replace('template-', '');

      // Generate preview
      console.log(`Generating preview for template: ${templateName}`);
      const result = await this.previewGenerator.generatePreviewFromEdgeCode(
        edgeCode,
        templateName,
        template.defaultColors
      );

      if (result.success) {
        // Update template with preview URL
        await this.templateRepository.update(templateId, {
          previewUrl: result.previewPath,
        });
        console.log(`Preview generated and saved: ${result.previewPath}`);
      } else {
        console.error(`Failed to generate preview for ${templateName}: ${result.error}`);
      }
    } catch (error) {
      // Log but don't fail the request
      console.error('Error ensuring template preview:', error);
    }
  }
}
