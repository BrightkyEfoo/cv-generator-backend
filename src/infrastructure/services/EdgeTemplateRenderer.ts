import { Edge } from 'edge.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { CV } from '../../domain/entities/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface TemplateData {
  personalInfo: CV['personalInfo'];
  summary: string;
  objective: string;
  experiences: CV['experiences'];
  education: CV['education'];
  skills: CV['skills'];
  languages: CV['languages'];
  certifications: CV['certifications'];
  projects: CV['projects'];
  publications: CV['publications'];
  awards: CV['awards'];
  volunteer: CV['volunteer'];
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

  /**
   * Convert Handlebars-style syntax to Edge.js syntax
   * This allows templates written in Handlebars format to work with Edge.js
   */
  private convertHandlebarsToEdge(code: string): string {
    let converted = code;

    // Convert {{#if condition}} to @if(condition)
    converted = converted.replace(/\{\{#if\s+([^}]+)\}\}/g, '@if($1)');

    // Convert {{else}} to @else
    converted = converted.replace(/\{\{else\}\}/g, '@else');

    // Convert {{/if}} to @endif
    converted = converted.replace(/\{\{\/if\}\}/g, '@endif');

    // Convert {{#each items}} to @each(item in items)
    // Note: Edge uses "item in items" syntax, Handlebars uses just "items"
    converted = converted.replace(
      /\{\{#each\s+([a-zA-Z_][a-zA-Z0-9_.]*)\}\}/g,
      (match, arrayName) => {
        // Generate singular form of the variable name
        const itemName = arrayName.endsWith('s')
          ? arrayName.slice(0, -1)
          : arrayName + 'Item';
        return `@each(${itemName} in ${arrayName})`;
      }
    );

    // Convert {{/each}} to @endeach
    converted = converted.replace(/\{\{\/each\}\}/g, '@endeach');

    // Convert {{this.property}} to {{itemName.property}} inside @each blocks
    // This is handled by replacing "this." with the loop variable
    // We need to track the current loop variable name
    const lines = converted.split('\n');
    const loopVarStack: string[] = [];
    const convertedLines = lines.map((line) => {
      // Check if line starts a new @each block
      const eachMatch = line.match(/@each\((\w+)\s+in\s+/);
      if (eachMatch) {
        loopVarStack.push(eachMatch[1]);
      }

      // Check if line ends an @each block
      if (line.includes('@endeach')) {
        loopVarStack.pop();
      }

      // Replace {{this.xxx}} with {{loopVar.xxx}} or just {{this}} with {{loopVar}}
      if (loopVarStack.length > 0) {
        const currentVar = loopVarStack[loopVarStack.length - 1];
        line = line.replace(/\{\{this\.([^}]+)\}\}/g, `{{${currentVar}.$1}}`);
        line = line.replace(/\{\{this\}\}/g, `{{${currentVar}}}`);
      }

      return line;
    });

    converted = convertedLines.join('\n');

    return converted;
  }

  /**
   * Check if template code uses Handlebars syntax
   */
  private isHandlebarsSyntax(code: string): boolean {
    return code.includes('{{#if') || code.includes('{{#each') || code.includes('{{/if');
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
      // Convert Handlebars syntax to Edge.js syntax if needed
      let code = edgeCode;
      if (this.isHandlebarsSyntax(code)) {
        code = this.convertHandlebarsToEdge(code);
      }

      return await this.edge.renderRaw(code, data);
    } catch (error) {
      console.error('Error rendering template from string:', error);
      throw new Error('Failed to render template from edge code');
    }
  }

  getTemplatesPath(): string {
    return this.templatesPath;
  }
}
