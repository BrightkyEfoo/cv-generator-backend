import type { PersonalInfo } from './PersonalInfo.js';
import type { Experience } from './Experience.js';
import type { Education } from './Education.js';
import type { Skill } from './Skill.js';
import type { Language } from './Language.js';
import type { Certification } from './Certification.js';
import type { Project } from './Project.js';
import type { Publication } from './Publication.js';
import type { Award } from './Award.js';
import type { Volunteer } from './Volunteer.js';
import type { Interest } from './Interest.js';
import type { Reference } from './Reference.js';
import type { CustomSection } from './CustomSection.js';
import type { CVLayout } from './SectionConfig.js';

export interface CVTypography {
  headingFont: string;
  bodyFont: string;
  headingSize: number;
  bodySize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface CVColors {
  primary: string;
  secondary: string;
  accent?: string;
  text: string;
  headings: string;
  background: string;
  dividers: string;
}

export interface CVSpacing {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  sectionGap: number;
  itemGap: number;
}

export interface CVCustomization {
  templateId: string;
  colors: CVColors;
  typography: CVTypography;
  spacing: CVSpacing;
  layout: CVLayout;
  watermark?: string;
}

export interface CV {
  id: string;
  sessionId: string;
  title: string;
  personalInfo: PersonalInfo;
  summary?: string;
  objective?: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  publications: Publication[];
  awards: Award[];
  volunteer: Volunteer[];
  interests: Interest[];
  references: Reference[];
  customSections: CustomSection[];
  customization: CVCustomization;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    lastExportedAt?: Date;
  };
  isPaid: boolean;
  paymentId?: string;
}
