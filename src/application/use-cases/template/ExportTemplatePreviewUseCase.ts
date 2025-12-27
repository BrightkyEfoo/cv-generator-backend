import type { ITemplateRepository, ITemplatePreviewGenerator } from '../../../domain/interfaces/index.js';
import { NotFoundError } from '../../../shared/errors/index.js';
import { EdgeTemplateRenderer, TemplateData } from '../../../infrastructure/services/EdgeTemplateRenderer.js';
import { mockCVData, defaultTemplateColors, defaultTypography } from '../../../infrastructure/templates/mock-cv-data.js';
import puppeteer, { Browser } from 'puppeteer';

export class ExportTemplatePreviewUseCase {
  private browser: Browser | null = null;
  private edgeRenderer: EdgeTemplateRenderer;

  constructor(
    private readonly templateRepository: ITemplateRepository,
    private readonly previewGenerator?: ITemplatePreviewGenerator
  ) {
    this.edgeRenderer = new EdgeTemplateRenderer();
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private createTemplateData(template: { defaultColors: Record<string, string> }): TemplateData {
    return {
      ...mockCVData,
      colors: {
        ...defaultTemplateColors,
        ...template.defaultColors,
        dividers: '#e0e0e0',
      },
      typography: {
        bodyFont: defaultTypography.fontFamily,
        headingFont: defaultTypography.headingFont,
        bodySize: defaultTypography.bodySize,
        headingSize: defaultTypography.headingSize,
        lineHeight: defaultTypography.lineHeight,
        letterSpacing: 0,
      },
      layout: {
        sections: [],
        sidebarSections: [],
        hasSidebar: true,
        sidebarPosition: 'left',
        headerStyle: 'centered',
        dateFormat: 'MMM YYYY',
        showPageNumbers: false,
      },
      spacing: {
        sectionGap: 20,
        itemGap: 15,
        margins: { top: 40, right: 40, bottom: 40, left: 40 },
      },
    };
  }

  async generatePreviewImage(templateId: string): Promise<Buffer> {
    const template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new NotFoundError('Template', templateId);
    }

    const edgeCode = await this.templateRepository.getEdgeCode(templateId);
    if (!edgeCode) {
      throw new NotFoundError('Template edge code', templateId);
    }

    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const templateData = this.createTemplateData(template);
      const html = await this.edgeRenderer.renderFromString(edgeCode, templateData);

      await page.setViewport({ width: 595, height: 842 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false,
        clip: { x: 0, y: 0, width: 595, height: 842 },
      });

      return Buffer.from(screenshot);
    } finally {
      await page.close();
    }
  }

  async generateAndSavePreview(templateId: string): Promise<string | null> {
    if (!this.previewGenerator) {
      return null;
    }

    const template = await this.templateRepository.findById(templateId);
    if (!template) {
      throw new NotFoundError('Template', templateId);
    }

    const edgeCode = await this.templateRepository.getEdgeCode(templateId);
    if (!edgeCode) {
      return null;
    }

    const templateName = templateId.replace('template-', '');
    const result = await this.previewGenerator.generatePreviewFromEdgeCode(
      edgeCode,
      templateName,
      template.defaultColors
    );

    if (result.success) {
      await this.templateRepository.update(templateId, {
        previewUrl: result.previewPath,
      });
      return result.previewPath;
    }

    return null;
  }
}
