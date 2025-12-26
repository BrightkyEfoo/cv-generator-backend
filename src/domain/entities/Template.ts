export interface TemplateFeature {
  hasPhoto: boolean;
  hasSidebar: boolean;
  hasColorCustomization: boolean;
  hasFontCustomization: boolean;
  maxSections: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  category: 'professional' | 'creative' | 'modern' | 'simple' | 'academic';
  features: TemplateFeature;
  defaultColors: {
    primary: string;
    secondary: string;
  };
  availableFonts: string[];
  isActive: boolean;
}
