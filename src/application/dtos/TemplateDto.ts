import type { TemplateFeature } from '../../domain/entities/index.js';

export interface TemplateResponseDto {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  category: string;
  features: TemplateFeature;
  defaultColors: {
    primary: string;
    secondary: string;
  };
  availableFonts: string[];
}

export interface TemplateListResponseDto {
  templates: TemplateResponseDto[];
  total: number;
}
