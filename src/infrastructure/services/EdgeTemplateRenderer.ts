import { Edge } from 'edge.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { CV } from '../../domain/entities/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface TemplateData {
  personalInfo: CV['personalInfo'];
  summary: string;
  experiences: CV['experiences'];
  education: CV['education'];
  skills: CV['skills'];
  languages: CV['languages'];
  certifications: CV['certifications'];
  projects: CV['projects'];
  awards: CV['awards'];
  interests: CV['interests'];
  references: CV['references'];
  customSections: CV['customSections'];
  colors: CV['customization']['colors'];
  typography: CV['customization']['typography'];
  layout: CV['customization']['layout'];
  spacing: CV['customization']['spacing'];
}

export class EdgeTemplateRenderer {
  private edge: Edge;
  private templatesPath: string;

  constructor() {
    this.edge = Edge.create();
    this.templatesPath = join(__dirname, '../templates/edges');

    this.edge.mount(this.templatesPath);
  }

  async renderFromFile(templateName: string, data: TemplateData): Promise<string> {
    try {
      return await this.edge.render(templateName, data);
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error);
      throw new Error(`Failed to render template: ${templateName}`);
    }
  }

  async renderFromString(edgeCode: string, data: TemplateData): Promise<string> {
    try {
      return await this.edge.renderRaw(edgeCode, data);
    } catch (error) {
      console.error('Error rendering template from string:', error);
      throw new Error('Failed to render template from edge code');
    }
  }

  getTemplatesPath(): string {
    return this.templatesPath;
  }
}
