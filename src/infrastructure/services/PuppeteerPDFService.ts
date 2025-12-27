import puppeteer, { Browser } from 'puppeteer';
import type { CV, TemplateLanguage } from '../../domain/entities/index.js';
import type { IPDFService } from '../../application/interfaces/index.js';
import { EdgeTemplateRenderer, TemplateData } from './EdgeTemplateRenderer.js';

export class PuppeteerPDFService implements IPDFService {
  private browser: Browser | null = null;
  private edgeRenderer: EdgeTemplateRenderer;

  constructor(
    private readonly getEdgeCode: (templateId: string, language?: TemplateLanguage) => Promise<string | null>
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

  async generatePreview(cv: CV): Promise<Buffer> {
    return this.generatePDF(cv, false);
  }

  async generateFull(cv: CV): Promise<Buffer> {
    return this.generatePDF(cv, false);
  }

  async generateWithWatermark(cv: CV): Promise<Buffer> {
    return this.generatePDF(cv, true);
  }

  async generatePreviewImage(cv: CV): Promise<Buffer> {
    const images = await this.generatePreviewImages(cv);
    return images[0];
  }

  async generatePreviewImages(cv: CV): Promise<Buffer[]> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const edgeCode = await this.getEdgeCode(cv.customization.templateId, cv.templateLanguage);

      let html: string;

      if (edgeCode) {
        const templateData = this.cvToTemplateData(cv);
        html = await this.edgeRenderer.renderFromString(edgeCode, templateData);
      } else {
        html = this.createFallbackHTML(cv);
      }

      // Add watermark for preview
      html = this.addImageWatermark(html);

      // Add print/page styles for proper pagination with margins
      const margins = cv.customization.spacing.margins;
      html = this.addPageStyles(html, margins);

      // Set viewport to A4 size (595 x 842 pixels at 72 DPI)
      await page.setViewport({ width: 595, height: 842 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Generate PDF first, then convert pages to images for accurate pagination
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: `${margins.top}px`,
          right: `${margins.right}px`,
          bottom: `${margins.bottom}px`,
          left: `${margins.left}px`,
        },
      });

      // Convert PDF pages to images
      const images = await this.pdfToImages(Buffer.from(pdfBuffer));
      return images;
    } finally {
      await page.close();
    }
  }

  private addPageStyles(html: string, margins: { top: number; right: number; bottom: number; left: number }): string {
    const pageStyles = `
      <style>
        @page {
          size: A4;
          margin: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
        }
        /* Prevent elements from being cut in the middle */
        .section, .item, .experience-item, .education-item, .skill-category,
        .certification-item, .project-item, .language-item, .interest-item,
        .award-item, .volunteer-item, .publication-item, .reference-item {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        /* Add some breathing room before page breaks */
        h2, h3 {
          break-after: avoid;
          page-break-after: avoid;
        }
      </style>
    `;

    // Insert after <head> or at the beginning if no head
    if (html.includes('<head>')) {
      return html.replace('<head>', `<head>${pageStyles}`);
    } else if (html.includes('<html>')) {
      return html.replace('<html>', `<html><head>${pageStyles}</head>`);
    }
    return pageStyles + html;
  }

  private async pdfToImages(pdfBuffer: Buffer): Promise<Buffer[]> {
    const browser = await this.getBrowser();
    const images: Buffer[] = [];

    try {
      // Use pdf.js approach via data URL
      const base64Pdf = pdfBuffer.toString('base64');
      const page = await browser.newPage();

      try {
        // Set viewport to A4 size
        await page.setViewport({ width: 595, height: 842 });

        // Create HTML page that renders PDF using pdf.js
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
            <style>
              * { margin: 0; padding: 0; }
              body { background: white; }
              canvas { display: block; }
            </style>
          </head>
          <body>
            <canvas id="canvas"></canvas>
            <script>
              pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

              window.renderPage = async function(pageNum) {
                const pdfData = atob('${base64Pdf}');
                const uint8Array = new Uint8Array(pdfData.length);
                for (let i = 0; i < pdfData.length; i++) {
                  uint8Array[i] = pdfData.charCodeAt(i);
                }

                const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
                const page = await pdf.getPage(pageNum);

                const scale = 1.0;
                const viewport = page.getViewport({ scale });

                const canvas = document.getElementById('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport }).promise;
                return pdf.numPages;
              };
            </script>
          </body>
          </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Get number of pages and render each
        const numPages = await page.evaluate(async () => {
          return await (window as unknown as { renderPage: (n: number) => Promise<number> }).renderPage(1);
        });

        // Screenshot first page
        const screenshot1 = await page.screenshot({ type: 'png', fullPage: false });
        images.push(Buffer.from(screenshot1));

        // Render and screenshot remaining pages
        for (let i = 2; i <= numPages; i++) {
          await page.evaluate(async (pageNum: number) => {
            await (window as unknown as { renderPage: (n: number) => Promise<number> }).renderPage(pageNum);
          }, i);

          const screenshot = await page.screenshot({ type: 'png', fullPage: false });
          images.push(Buffer.from(screenshot));
        }
      } finally {
        await page.close();
      }
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      // Fallback: return empty array or single blank image
      throw error;
    }

    return images;
  }

  private addImageWatermark(html: string): string {
    const watermarkStyle = `
      <style>
        .preview-watermark {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          overflow: hidden;
        }
        .watermark-row {
          display: flex;
          justify-content: space-around;
          width: 150%;
          transform: rotate(-30deg);
        }
        .watermark-text {
          font-size: 24px;
          color: rgba(150, 150, 150, 0.25);
          font-weight: bold;
          white-space: nowrap;
          font-family: Arial, sans-serif;
          text-transform: uppercase;
          letter-spacing: 4px;
        }
      </style>
      <div class="preview-watermark">
        <div class="watermark-row">
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
        </div>
        <div class="watermark-row">
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
        </div>
        <div class="watermark-row">
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
        </div>
        <div class="watermark-row">
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
        </div>
        <div class="watermark-row">
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
          <span class="watermark-text">APERÇU</span>
        </div>
      </div>
    `;

    return html.replace('</body>', `${watermarkStyle}</body>`);
  }

  private cvToTemplateData(cv: CV): TemplateData {
    return {
      personalInfo: cv.personalInfo,
      summary: cv.summary || '',
      objective: cv.objective || '',
      experiences: cv.experiences,
      education: cv.education,
      skills: cv.skills,
      languages: cv.languages,
      certifications: cv.certifications,
      projects: cv.projects,
      publications: cv.publications,
      awards: cv.awards,
      volunteer: cv.volunteer,
      interests: cv.interests,
      references: cv.references,
      customSections: cv.customSections,
      colors: cv.customization.colors,
      typography: cv.customization.typography,
      layout: cv.customization.layout,
      spacing: cv.customization.spacing,
    };
  }

  private async generatePDF(cv: CV, watermark: boolean): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const edgeCode = await this.getEdgeCode(cv.customization.templateId, cv.templateLanguage);

      let html: string;

      if (edgeCode) {
        const templateData = this.cvToTemplateData(cv);
        html = await this.edgeRenderer.renderFromString(edgeCode, templateData);
      } else {
        html = this.createFallbackHTML(cv);
      }

      if (watermark) {
        html = this.addWatermark(html);
      }

      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: `${cv.customization.spacing.margins.top}px`,
          right: `${cv.customization.spacing.margins.right}px`,
          bottom: `${cv.customization.spacing.margins.bottom}px`,
          left: `${cv.customization.spacing.margins.left}px`,
        },
      });

      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  }

  async generateTemplatePreview(
    edgeCode: string,
    mockData: CV,
    outputPath: string
  ): Promise<string> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();

    try {
      const templateData = this.cvToTemplateData(mockData);
      const html = await this.edgeRenderer.renderFromString(edgeCode, templateData);

      await page.setContent(html, { waitUntil: 'networkidle0' });

      await page.screenshot({
        path: outputPath,
        fullPage: false,
        clip: { x: 0, y: 0, width: 595, height: 842 },
      });

      return outputPath;
    } finally {
      await page.close();
    }
  }

  private addWatermark(html: string): string {
    const watermarkStyle = `
      <style>
        .pdf-watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 80px;
          color: rgba(200, 200, 200, 0.3);
          font-weight: bold;
          pointer-events: none;
          z-index: 10000;
          white-space: nowrap;
        }
      </style>
      <div class="pdf-watermark">PREVIEW</div>
    `;

    return html.replace('</body>', `${watermarkStyle}</body>`);
  }

  private createFallbackHTML(cv: CV): string {
    const { colors, typography } = cv.customization;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: ${typography.bodyFont}, Arial, sans-serif;
            font-size: ${typography.bodySize}pt;
            line-height: ${typography.lineHeight};
            color: ${colors.text};
            background: ${colors.background};
            padding: 40px;
          }
          h1, h2, h3 {
            font-family: ${typography.headingFont}, Arial, sans-serif;
            color: ${colors.headings};
          }
          h1 { font-size: ${typography.headingSize + 8}pt; margin-bottom: 5px; }
          h2 { font-size: ${typography.headingSize}pt; color: ${colors.primary}; border-bottom: 2px solid ${colors.primary}; padding-bottom: 5px; margin-bottom: 10px; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid ${colors.dividers}; }
          .title { color: ${colors.primary}; font-size: ${typography.bodySize + 2}pt; }
          .contact { margin-top: 10px; font-size: ${typography.bodySize}pt; }
          .section { margin-bottom: 25px; }
          .item { margin-bottom: 15px; }
          .item-header { display: flex; justify-content: space-between; }
          .item-title { font-weight: bold; }
          .item-date { color: ${colors.secondary}; }
          .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
          .skill-tag { background: ${colors.primary}20; color: ${colors.primary}; padding: 4px 10px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${cv.personalInfo.firstName} ${cv.personalInfo.lastName}</h1>
          ${cv.personalInfo.title ? `<div class="title">${cv.personalInfo.title}</div>` : ''}
          <div class="contact">
            ${[cv.personalInfo.email, cv.personalInfo.phone, cv.personalInfo.city ? `${cv.personalInfo.city}, ${cv.personalInfo.country}` : ''].filter(Boolean).join(' | ')}
          </div>
        </div>

        ${cv.summary ? `
          <div class="section">
            <h2>Professional Summary</h2>
            <p>${cv.summary}</p>
          </div>
        ` : ''}

        ${cv.experiences.length > 0 ? `
          <div class="section">
            <h2>Work Experience</h2>
            ${cv.experiences.map(exp => `
              <div class="item">
                <div class="item-header">
                  <span class="item-title">${exp.jobTitle} at ${exp.company}</span>
                  <span class="item-date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
                </div>
                ${exp.location ? `<div>${exp.location}</div>` : ''}
                <p>${exp.description}</p>
                ${exp.achievements?.length ? `<ul>${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${cv.education.length > 0 ? `
          <div class="section">
            <h2>Education</h2>
            ${cv.education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <span class="item-title">${edu.degree} in ${edu.field}</span>
                  <span class="item-date">${edu.startDate} - ${edu.endDate}</span>
                </div>
                <div>${edu.institution}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${cv.skills.length > 0 ? `
          <div class="section">
            <h2>Skills</h2>
            <div class="skills-list">
              ${cv.skills.map(s => `<span class="skill-tag">${s.name}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${cv.languages.length > 0 ? `
          <div class="section">
            <h2>Languages</h2>
            <p>${cv.languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `;
  }
}
