export interface TemplateFeature {
  hasPhoto: boolean;
  hasSidebar: boolean;
  hasColorCustomization: boolean;
  hasFontCustomization: boolean;
  maxSections: number;
}

export type TemplateLanguage = 'fr' | 'en' | 'es' | 'de' | 'pt' | 'it' | 'ar' | 'zh';

export interface TemplateEdgeCodes {
  default: string;
  [language: string]: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  category: 'professional' | 'creative' | 'modern' | 'simple' | 'academic';
  edgeCodes: TemplateEdgeCodes;
  defaultLanguage: TemplateLanguage;
  availableLanguages: TemplateLanguage[];
  features: TemplateFeature;
  defaultColors: {
    primary: string;
    secondary: string;
  };
  availableFonts: string[];
  isActive: boolean;
}
