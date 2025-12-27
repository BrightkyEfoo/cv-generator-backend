import type { CV } from '../../../domain/entities/index.js';
import type { ICVRepository } from '../../../domain/interfaces/index.js';
import type {
  UpdatePersonalInfoDto,
  UpdateSummaryDto,
  UpdateExperiencesDto,
  UpdateEducationDto,
  UpdateSkillsDto,
  UpdateLanguagesDto,
  UpdateCertificationsDto,
  UpdateProjectsDto,
  UpdatePublicationsDto,
  UpdateAwardsDto,
  UpdateVolunteerDto,
  UpdateInterestsDto,
  UpdateReferencesDto,
  UpdateCustomSectionsDto,
  UpdateCustomizationDto,
  UpdateTemplateLanguageDto,
} from '../../dtos/index.js';
import { NotFoundError } from '../../../shared/errors/index.js';

export class UpdateCVUseCase {
  constructor(private readonly cvRepository: ICVRepository) {}

  private async getCV(cvId: string): Promise<CV> {
    const cv = await this.cvRepository.findById(cvId);
    if (!cv) {
      throw new NotFoundError('CV', cvId);
    }
    return cv;
  }

  private updateMetadata(cv: CV): CV {
    return {
      ...cv,
      metadata: {
        ...cv.metadata,
        updatedAt: new Date(),
        version: cv.metadata.version + 1,
      },
    };
  }

  async updatePersonalInfo(dto: UpdatePersonalInfoDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        ...dto.personalInfo,
        socialLinks: dto.personalInfo.socialLinks ?? cv.personalInfo.socialLinks,
      },
    });
    return this.cvRepository.update(updated);
  }

  async updateSummary(dto: UpdateSummaryDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      summary: dto.summary,
    });
    return this.cvRepository.update(updated);
  }

  async updateObjective(dto: { cvId: string; objective?: string }): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      objective: dto.objective,
    });
    return this.cvRepository.update(updated);
  }

  async updateExperiences(dto: UpdateExperiencesDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      experiences: dto.experiences,
    });
    return this.cvRepository.update(updated);
  }

  async updateEducation(dto: UpdateEducationDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      education: dto.education,
    });
    return this.cvRepository.update(updated);
  }

  async updateSkills(dto: UpdateSkillsDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      skills: dto.skills,
    });
    return this.cvRepository.update(updated);
  }

  async updateLanguages(dto: UpdateLanguagesDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      languages: dto.languages,
    });
    return this.cvRepository.update(updated);
  }

  async updateCertifications(dto: UpdateCertificationsDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      certifications: dto.certifications,
    });
    return this.cvRepository.update(updated);
  }

  async updateProjects(dto: UpdateProjectsDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      projects: dto.projects,
    });
    return this.cvRepository.update(updated);
  }

  async updatePublications(dto: UpdatePublicationsDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      publications: dto.publications,
    });
    return this.cvRepository.update(updated);
  }

  async updateAwards(dto: UpdateAwardsDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      awards: dto.awards,
    });
    return this.cvRepository.update(updated);
  }

  async updateVolunteer(dto: UpdateVolunteerDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      volunteer: dto.volunteer,
    });
    return this.cvRepository.update(updated);
  }

  async updateInterests(dto: UpdateInterestsDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      interests: dto.interests,
    });
    return this.cvRepository.update(updated);
  }

  async updateReferences(dto: UpdateReferencesDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      references: dto.references,
    });
    return this.cvRepository.update(updated);
  }

  async updateCustomSections(dto: UpdateCustomSectionsDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      customSections: dto.customSections,
    });
    return this.cvRepository.update(updated);
  }

  async updateCustomization(dto: UpdateCustomizationDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      customization: {
        ...cv.customization,
        ...dto.customization,
        colors: dto.customization.colors
          ? { ...cv.customization.colors, ...dto.customization.colors }
          : cv.customization.colors,
        typography: dto.customization.typography
          ? { ...cv.customization.typography, ...dto.customization.typography }
          : cv.customization.typography,
        spacing: dto.customization.spacing
          ? { ...cv.customization.spacing, ...dto.customization.spacing }
          : cv.customization.spacing,
        layout: dto.customization.layout
          ? { ...cv.customization.layout, ...dto.customization.layout }
          : cv.customization.layout,
      },
    });
    return this.cvRepository.update(updated);
  }

  async updateTemplateLanguage(dto: UpdateTemplateLanguageDto): Promise<CV> {
    const cv = await this.getCV(dto.cvId);
    const updated = this.updateMetadata({
      ...cv,
      templateLanguage: dto.templateLanguage,
    });
    return this.cvRepository.update(updated);
  }
}
