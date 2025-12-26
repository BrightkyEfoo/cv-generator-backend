import type { CV } from '../../../domain/entities/index.js';
import type { ICVRepository, ITemplateRepository, ITemplatePreviewGenerator } from '../../../domain/interfaces/index.js';
import { NotFoundError } from '../../../shared/errors/index.js';

export class GetCVUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly templateRepository?: ITemplateRepository,
    private readonly previewGenerator?: ITemplatePreviewGenerator
  ) {}

  async getById(cvId: string): Promise<CV> {
    const cv = await this.cvRepository.findById(cvId);
    if (!cv) {
      throw new NotFoundError('CV', cvId);
    }

    // Generate template preview if missing (don't await to avoid blocking)
    this.ensureTemplatePreview(cv.customization.templateId).catch((err) => {
      console.error('Background preview generation failed:', err);
    });

    return cv;
  }

  async getBySessionId(sessionId: string): Promise<CV> {
    const cv = await this.cvRepository.findBySessionId(sessionId);
    if (!cv) {
      throw new NotFoundError('CV for session', sessionId);
    }

    // Generate template preview if missing (don't await to avoid blocking)
    this.ensureTemplatePreview(cv.customization.templateId).catch((err) => {
      console.error('Background preview generation failed:', err);
    });

    return cv;
  }

  private async ensureTemplatePreview(templateId: string): Promise<void> {
    // Skip if dependencies not available
    if (!this.templateRepository || !this.previewGenerator) {
      return;
    }

    try {
      const template = await this.templateRepository.findById(templateId);

      // Skip if template not found or already has preview
      if (!template || template.previewUrl) {
        return;
      }

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
