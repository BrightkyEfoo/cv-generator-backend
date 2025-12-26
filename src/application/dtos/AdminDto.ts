import type { AdminRole } from '../../domain/entities/index.js';

export interface AdminLoginDto {
  email: string;
  password: string;
}

export interface AdminLoginResponseDto {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
  };
}

export interface CreateTemplateDto {
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'simple' | 'academic';
  edgeCode: string;
  features: {
    hasPhoto: boolean;
    hasSidebar: boolean;
    hasColorCustomization: boolean;
    hasFontCustomization: boolean;
    maxSections: number;
  };
  defaultColors: {
    primary: string;
    secondary: string;
  };
  availableFonts: string[];
}

export interface UpdateTemplateDto {
  name?: string;
  description?: string;
  category?: 'professional' | 'creative' | 'modern' | 'simple' | 'academic';
  edgeCode?: string;
  features?: {
    hasPhoto?: boolean;
    hasSidebar?: boolean;
    hasColorCustomization?: boolean;
    hasFontCustomization?: boolean;
    maxSections?: number;
  };
  defaultColors?: {
    primary?: string;
    secondary?: string;
  };
  availableFonts?: string[];
  isActive?: boolean;
}
