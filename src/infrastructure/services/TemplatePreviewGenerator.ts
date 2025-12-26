import puppeteer, { Browser } from 'puppeteer';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { readFile } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { EdgeTemplateRenderer, TemplateData } from './EdgeTemplateRenderer.js';
import { mockCVData, defaultTemplateColors, defaultTypography } from '../templates/mock-cv-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface TemplatePreviewResult {
  templateName: string;
  previewPath: string;
  success: boolean;
  error?: string;
}

export class TemplatePreviewGenerator {
  private browser: Browser | null = null;
  private edgeRenderer: EdgeTemplateRenderer;
  private templatesPath: string;
  private previewsOutputPath: string;

  constructor(previewsOutputPath?: string) {
    this.edgeRenderer = new EdgeTemplateRenderer();
    this.templatesPath = this.edgeRenderer.getTemplatesPath();
    this.previewsOutputPath = previewsOutputPath || join(__dirname, '../../../public/previews');

    if (!existsSync(this.previewsOutputPath)) {
      mkdirSync(this.previewsOutputPath, { recursive: true });
    }
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

  private createTemplateData(): TemplateData {
    return {
      ...mockCVData,
      colors: {
        ...defaultTemplateColors,
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

  async generatePreviewForTemplate(
    templateName: string,
    customColors?: Partial<typeof defaultTemplateColors>
  ): Promise<TemplatePreviewResult> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const templateData = this.createTemplateData();

      if (customColors) {
        templateData.colors = { ...templateData.colors, ...customColors };
      }

      const templateFileName = templateName.replace('.edge', '');
      const html = await this.edgeRenderer.renderFromFile(templateFileName, templateData);

      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.setViewport({ width: 595, height: 842 });

      const previewFileName = `${templateFileName}-preview.png`;
      const previewPath = join(this.previewsOutputPath, previewFileName);

      await page.screenshot({
        path: previewPath,
        fullPage: false,
        clip: { x: 0, y: 0, width: 595, height: 842 },
      });

      return {
        templateName: templateFileName,
        previewPath: `/previews/${previewFileName}`,
        success: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Failed to generate preview for ${templateName}:`, errorMessage);
      return {
        templateName,
        previewPath: '',
        success: false,
        error: errorMessage,
      };
    } finally {
      await page.close();
    }
  }

  async generatePreviewFromEdgeCode(
    edgeCode: string,
    outputName: string,
    customColors?: Partial<typeof defaultTemplateColors>
  ): Promise<TemplatePreviewResult> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const templateData = this.createTemplateData();

      if (customColors) {
        templateData.colors = { ...templateData.colors, ...customColors };
      }

      const html = await this.edgeRenderer.renderFromString(edgeCode, templateData);

      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.setViewport({ width: 595, height: 842 });

      const previewFileName = `${outputName}-preview.png`;
      const previewPath = join(this.previewsOutputPath, previewFileName);

      await page.screenshot({
        path: previewPath,
        fullPage: false,
        clip: { x: 0, y: 0, width: 595, height: 842 },
      });

      return {
        templateName: outputName,
        previewPath: `/previews/${previewFileName}`,
        success: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Failed to generate preview for ${outputName}:`, errorMessage);
      return {
        templateName: outputName,
        previewPath: '',
        success: false,
        error: errorMessage,
      };
    } finally {
      await page.close();
    }
  }

  async generateAllPreviews(): Promise<TemplatePreviewResult[]> {
    const results: TemplatePreviewResult[] = [];

    try {
      const files = readdirSync(this.templatesPath);
      const edgeFiles = files.filter((f) => f.endsWith('.edge'));

      console.log(`Found ${edgeFiles.length} templates to generate previews for`);

      for (const file of edgeFiles) {
        console.log(`Generating preview for: ${file}`);
        const result = await this.generatePreviewForTemplate(file);
        results.push(result);

        if (result.success) {
          console.log(`  Preview saved: ${result.previewPath}`);
        } else {
          console.error(`  Failed: ${result.error}`);
        }
      }

      await this.closeBrowser();
    } catch (error) {
      console.error('Error generating all previews:', error);
    }

    return results;
  }

  getAvailableTemplates(): string[] {
    try {
      const files = readdirSync(this.templatesPath);
      return files.filter((f) => f.endsWith('.edge')).map((f) => f.replace('.edge', ''));
    } catch (error) {
      console.error('Error reading templates directory:', error);
      return [];
    }
  }

  async loadTemplateEdgeCode(templateName: string): Promise<string> {
    const filePath = join(this.templatesPath, `${templateName}.edge`);
    try {
      return await readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Template not found: ${templateName}`);
    }
  }
}
