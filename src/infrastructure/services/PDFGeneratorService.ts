import PDFDocument from 'pdfkit';
import type { CV } from '../../domain/entities/index.js';
import type { IPDFService } from '../../application/interfaces/index.js';

type PDFDoc = InstanceType<typeof PDFDocument>;

export class PDFGeneratorService implements IPDFService {
  async generatePreview(cv: CV): Promise<Buffer> {
    return this.generatePDF(cv, { watermark: false, preview: true });
  }

  async generateFull(cv: CV): Promise<Buffer> {
    return this.generatePDF(cv, { watermark: false, preview: false });
  }

  async generateWithWatermark(cv: CV): Promise<Buffer> {
    return this.generatePDF(cv, { watermark: true, preview: false });
  }

  private async generatePDF(
    cv: CV,
    options: { watermark: boolean; preview: boolean }
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const { colors, typography, spacing, layout } = cv.customization;

      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: spacing.margins.top,
          right: spacing.margins.right,
          bottom: spacing.margins.bottom,
          left: spacing.margins.left,
        },
        info: {
          Title: cv.title,
          Author: `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`,
        },
      });

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      this.renderHeader(doc, cv, colors, typography);
      this.renderSummary(doc, cv, colors, typography, spacing);
      this.renderExperiences(doc, cv, colors, typography, spacing);
      this.renderEducation(doc, cv, colors, typography, spacing);
      this.renderSkills(doc, cv, colors, typography, spacing);
      this.renderLanguages(doc, cv, colors, typography, spacing);
      this.renderCertifications(doc, cv, colors, typography, spacing);
      this.renderProjects(doc, cv, colors, typography, spacing);
      this.renderCustomSections(doc, cv, colors, typography, spacing);

      if (options.watermark) {
        this.addWatermark(doc);
      }

      if (layout.showPageNumbers) {
        this.addPageNumbers(doc);
      }

      doc.end();
    });
  }

  private renderHeader(
    doc: PDFDoc,
    cv: CV,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography']
  ): void {
    const { personalInfo } = cv;
    const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;

    doc
      .fillColor(colors.headings)
      .fontSize(typography.headingSize + 8)
      .font('Helvetica-Bold')
      .text(fullName, { align: 'center' });

    if (personalInfo.title) {
      doc
        .moveDown(0.3)
        .fillColor(colors.primary)
        .fontSize(typography.bodySize + 2)
        .font('Helvetica')
        .text(personalInfo.title, { align: 'center' });
    }

    const contactParts: string[] = [];
    if (personalInfo.email) contactParts.push(personalInfo.email);
    if (personalInfo.phone) contactParts.push(personalInfo.phone);
    if (personalInfo.city && personalInfo.country) {
      contactParts.push(`${personalInfo.city}, ${personalInfo.country}`);
    }

    if (contactParts.length > 0) {
      doc
        .moveDown(0.5)
        .fillColor(colors.text)
        .fontSize(typography.bodySize)
        .text(contactParts.join(' | '), { align: 'center' });
    }

    if (personalInfo.socialLinks.length > 0) {
      const links = personalInfo.socialLinks
        .map(link => link.label || link.url)
        .join(' | ');
      doc
        .moveDown(0.3)
        .fillColor(colors.primary)
        .fontSize(typography.bodySize - 1)
        .text(links, { align: 'center' });
    }

    doc.moveDown(1);
    this.drawDivider(doc, colors.dividers);
  }

  private renderSummary(
    doc: PDFDoc,
    cv: CV,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography'],
    spacing: CV['customization']['spacing']
  ): void {
    if (!cv.summary && !cv.objective) return;

    this.renderSectionHeader(doc, 'Professional Summary', colors, typography);

    doc
      .fillColor(colors.text)
      .fontSize(typography.bodySize)
      .font('Helvetica')
      .text(cv.summary || cv.objective || '', {
        align: 'justify',
        lineGap: typography.lineHeight,
      });

    doc.moveDown(spacing.sectionGap / 10);
  }

  private renderExperiences(
    doc: PDFDoc,
    cv: CV,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography'],
    spacing: CV['customization']['spacing']
  ): void {
    if (cv.experiences.length === 0) return;

    this.renderSectionHeader(doc, 'Work Experience', colors, typography);

    for (const exp of cv.experiences) {
      this.checkPageBreak(doc, 80);

      doc
        .fillColor(colors.headings)
        .fontSize(typography.bodySize + 1)
        .font('Helvetica-Bold')
        .text(exp.jobTitle, { continued: true })
        .fillColor(colors.text)
        .font('Helvetica')
        .text(` at ${exp.company}`);

      const dateRange = exp.current
        ? `${exp.startDate} - Present`
        : `${exp.startDate} - ${exp.endDate}`;

      doc
        .fillColor(colors.secondary || colors.primary)
        .fontSize(typography.bodySize - 1)
        .text(`${dateRange}${exp.location ? ` | ${exp.location}` : ''}`);

      doc
        .moveDown(0.3)
        .fillColor(colors.text)
        .fontSize(typography.bodySize)
        .text(exp.description, { align: 'justify' });

      if (exp.achievements && exp.achievements.length > 0) {
        doc.moveDown(0.3);
        for (const achievement of exp.achievements) {
          doc.text(`- ${achievement}`, { indent: 10 });
        }
      }

      doc.moveDown(spacing.itemGap / 10);
    }

    doc.moveDown(spacing.sectionGap / 20);
  }

  private renderEducation(
    doc: PDFDoc,
    cv: CV,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography'],
    spacing: CV['customization']['spacing']
  ): void {
    if (cv.education.length === 0) return;

    this.renderSectionHeader(doc, 'Education', colors, typography);

    for (const edu of cv.education) {
      this.checkPageBreak(doc, 60);

      doc
        .fillColor(colors.headings)
        .fontSize(typography.bodySize + 1)
        .font('Helvetica-Bold')
        .text(`${edu.degree} in ${edu.field}`);

      doc
        .fillColor(colors.text)
        .font('Helvetica')
        .fontSize(typography.bodySize)
        .text(edu.institution);

      const dateRange = edu.current
        ? `${edu.startDate} - Present`
        : `${edu.startDate} - ${edu.endDate}`;

      doc
        .fillColor(colors.secondary || colors.primary)
        .fontSize(typography.bodySize - 1)
        .text(dateRange);

      if (edu.gpa) {
        doc.text(`GPA: ${edu.gpa}`);
      }

      if (edu.description) {
        doc
          .moveDown(0.3)
          .fillColor(colors.text)
          .fontSize(typography.bodySize)
          .text(edu.description);
      }

      doc.moveDown(spacing.itemGap / 10);
    }

    doc.moveDown(spacing.sectionGap / 20);
  }

  private renderSkills(
    doc: PDFDoc,
    cv: CV,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography'],
    spacing: CV['customization']['spacing']
  ): void {
    if (cv.skills.length === 0) return;

    this.renderSectionHeader(doc, 'Skills', colors, typography);

    const skillsByCategory = cv.skills.reduce((acc, skill) => {
      const category = skill.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, typeof cv.skills>);

    for (const [category, skills] of Object.entries(skillsByCategory)) {
      if (Object.keys(skillsByCategory).length > 1) {
        doc
          .fillColor(colors.headings)
          .fontSize(typography.bodySize)
          .font('Helvetica-Bold')
          .text(category);
      }

      const skillNames = skills.map(s => {
        if (s.level) {
          return `${s.name} (${s.level})`;
        }
        return s.name;
      }).join(', ');

      doc
        .fillColor(colors.text)
        .font('Helvetica')
        .fontSize(typography.bodySize)
        .text(skillNames);

      doc.moveDown(0.3);
    }

    doc.moveDown(spacing.sectionGap / 20);
  }

  private renderLanguages(
    doc: PDFDoc,
    cv: CV,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography'],
    spacing: CV['customization']['spacing']
  ): void {
    if (cv.languages.length === 0) return;

    this.renderSectionHeader(doc, 'Languages', colors, typography);

    const langText = cv.languages
      .map(lang => `${lang.name} (${lang.proficiency})`)
      .join(', ');

    doc
      .fillColor(colors.text)
      .fontSize(typography.bodySize)
      .text(langText);

    doc.moveDown(spacing.sectionGap / 20);
  }

  private renderCertifications(
    doc: PDFDoc,
    cv: CV,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography'],
    spacing: CV['customization']['spacing']
  ): void {
    if (cv.certifications.length === 0) return;

    this.renderSectionHeader(doc, 'Certifications', colors, typography);

    for (const cert of cv.certifications) {
      doc
        .fillColor(colors.headings)
        .fontSize(typography.bodySize)
        .font('Helvetica-Bold')
        .text(cert.name, { continued: true })
        .fillColor(colors.text)
        .font('Helvetica')
        .text(` - ${cert.issuer}`);

      doc
        .fillColor(colors.secondary || colors.primary)
        .fontSize(typography.bodySize - 1)
        .text(cert.issueDate);

      doc.moveDown(spacing.itemGap / 15);
    }

    doc.moveDown(spacing.sectionGap / 20);
  }

  private renderProjects(
    doc: PDFDoc,
    cv: CV,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography'],
    spacing: CV['customization']['spacing']
  ): void {
    if (cv.projects.length === 0) return;

    this.renderSectionHeader(doc, 'Projects', colors, typography);

    for (const project of cv.projects) {
      this.checkPageBreak(doc, 60);

      doc
        .fillColor(colors.headings)
        .fontSize(typography.bodySize + 1)
        .font('Helvetica-Bold')
        .text(project.name);

      doc
        .fillColor(colors.text)
        .font('Helvetica')
        .fontSize(typography.bodySize)
        .text(project.description);

      if (project.technologies && project.technologies.length > 0) {
        doc
          .moveDown(0.2)
          .fillColor(colors.primary)
          .fontSize(typography.bodySize - 1)
          .text(`Technologies: ${project.technologies.join(', ')}`);
      }

      doc.moveDown(spacing.itemGap / 10);
    }

    doc.moveDown(spacing.sectionGap / 20);
  }

  private renderCustomSections(
    doc: PDFDoc,
    cv: CV,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography'],
    spacing: CV['customization']['spacing']
  ): void {
    for (const section of cv.customSections) {
      if (!section.isVisible) continue;

      this.renderSectionHeader(doc, section.name, colors, typography);

      for (const item of section.items) {
        this.checkPageBreak(doc, 50);

        if (item.title) {
          doc
            .fillColor(colors.headings)
            .fontSize(typography.bodySize + 1)
            .font('Helvetica-Bold')
            .text(item.title);
        }

        if (item.subtitle) {
          doc
            .fillColor(colors.text)
            .font('Helvetica')
            .fontSize(typography.bodySize)
            .text(item.subtitle);
        }

        if (item.description) {
          doc
            .moveDown(0.2)
            .fillColor(colors.text)
            .fontSize(typography.bodySize)
            .text(item.description);
        }

        for (const field of item.fields) {
          const value = Array.isArray(field.value)
            ? field.value.join(', ')
            : String(field.value);
          doc
            .fillColor(colors.text)
            .fontSize(typography.bodySize)
            .text(`${field.label}: ${value}`);
        }

        doc.moveDown(spacing.itemGap / 15);
      }

      doc.moveDown(spacing.sectionGap / 20);
    }
  }

  private renderSectionHeader(
    doc: PDFDoc,
    title: string,
    colors: CV['customization']['colors'],
    typography: CV['customization']['typography']
  ): void {
    this.checkPageBreak(doc, 50);

    doc
      .fillColor(colors.primary)
      .fontSize(typography.headingSize)
      .font('Helvetica-Bold')
      .text(title.toUpperCase(), { characterSpacing: 1 });

    doc.moveDown(0.3);
    this.drawDivider(doc, colors.primary, 2);
    doc.moveDown(0.5);
  }

  private drawDivider(doc: PDFDoc, color: string, height: number = 1): void {
    const startX = doc.page.margins.left;
    const endX = doc.page.width - doc.page.margins.right;
    const y = doc.y;

    doc
      .strokeColor(color)
      .lineWidth(height)
      .moveTo(startX, y)
      .lineTo(endX, y)
      .stroke();

    doc.y = y + height + 5;
  }

  private checkPageBreak(doc: PDFDoc, requiredSpace: number): void {
    const remainingSpace = doc.page.height - doc.page.margins.bottom - doc.y;
    if (remainingSpace < requiredSpace) {
      doc.addPage();
    }
  }

  private addWatermark(doc: PDFDoc): void {
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      doc.save();
      doc.rotate(-45, { origin: [doc.page.width / 2, doc.page.height / 2] });
      doc
        .fillColor('#cccccc')
        .opacity(0.3)
        .fontSize(60)
        .font('Helvetica-Bold')
        .text('PREVIEW', 0, doc.page.height / 2 - 30, {
          width: doc.page.width,
          align: 'center',
        });
      doc.restore();
    }
  }

  private addPageNumbers(doc: PDFDoc): void {
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc
        .fillColor('#666666')
        .fontSize(9)
        .text(
          `Page ${i + 1} of ${pages.count}`,
          doc.page.margins.left,
          doc.page.height - 30,
          { align: 'center', width: doc.page.width - doc.page.margins.left - doc.page.margins.right }
        );
    }
  }
}
