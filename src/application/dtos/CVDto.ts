import type {
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Language,
  Certification,
  Project,
  Publication,
  Award,
  Volunteer,
  Interest,
  Reference,
  CustomSection,
  CVCustomization,
} from '../../domain/entities/index.js';

export interface CreateCVDto {
  sessionId: string;
  title: string;
  templateId: string;
}

export interface UpdatePersonalInfoDto {
  cvId: string;
  personalInfo: PersonalInfo;
}

export interface UpdateSummaryDto {
  cvId: string;
  summary?: string;
  objective?: string;
}

export interface UpdateExperiencesDto {
  cvId: string;
  experiences: Experience[];
}

export interface UpdateEducationDto {
  cvId: string;
  education: Education[];
}

export interface UpdateSkillsDto {
  cvId: string;
  skills: Skill[];
}

export interface UpdateLanguagesDto {
  cvId: string;
  languages: Language[];
}

export interface UpdateCertificationsDto {
  cvId: string;
  certifications: Certification[];
}

export interface UpdateProjectsDto {
  cvId: string;
  projects: Project[];
}

export interface UpdatePublicationsDto {
  cvId: string;
  publications: Publication[];
}

export interface UpdateAwardsDto {
  cvId: string;
  awards: Award[];
}

export interface UpdateVolunteerDto {
  cvId: string;
  volunteer: Volunteer[];
}

export interface UpdateInterestsDto {
  cvId: string;
  interests: Interest[];
}

export interface UpdateReferencesDto {
  cvId: string;
  references: Reference[];
}

export interface UpdateCustomSectionsDto {
  cvId: string;
  customSections: CustomSection[];
}

export interface UpdateCustomizationDto {
  cvId: string;
  customization: Partial<CVCustomization>;
}

export interface CVResponseDto {
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
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}
