import type { CV } from '../../../domain/entities/index.js';
import type { ICVRepository, ITemplateRepository } from '../../../domain/interfaces/index.js';
import { NotFoundError } from '../../../shared/errors/index.js';
import { brightCVData, brightTemplateColors, brightTypography } from '../../../infrastructure/templates/bright-cv-data.js';

const PERSONAL_CV_ID = 'personal-cv-bright';
const BRIGHT_OS_TEMPLATE_ID = 'template-bright-os';

export class ManagePersonalCVUseCase {
  constructor(
    private readonly cvRepository: ICVRepository,
    private readonly templateRepository: ITemplateRepository
  ) {}

  async getPersonalCV(): Promise<CV | null> {
    return this.cvRepository.findById(PERSONAL_CV_ID);
  }

  async createOrUpdatePersonalCV(data?: Partial<CV>): Promise<CV> {
    const template = await this.templateRepository.findById(BRIGHT_OS_TEMPLATE_ID);
    if (!template) {
      throw new NotFoundError('Template', BRIGHT_OS_TEMPLATE_ID);
    }

    const existingCV = await this.cvRepository.findById(PERSONAL_CV_ID);
    const now = new Date();

    if (existingCV) {
      // Update existing CV
      const updatedCV: CV = {
        ...existingCV,
        ...data,
        id: PERSONAL_CV_ID,
        metadata: {
          ...existingCV.metadata,
          updatedAt: now,
          version: existingCV.metadata.version + 1,
        },
      };
      return this.cvRepository.update(updatedCV);
    }

    // Create new CV with Bright's data
    const cv: CV = {
      id: PERSONAL_CV_ID,
      sessionId: 'admin-personal-cv',
      title: 'CV Brightman EFO\'O DJOUCK KOMEKA',
      templateLanguage: 'fr',
      personalInfo: data?.personalInfo || brightCVData.personalInfo,
      summary: data?.summary || brightCVData.summary,
      objective: data?.objective || brightCVData.objective,
      experiences: data?.experiences || brightCVData.experiences,
      education: data?.education || brightCVData.education,
      skills: data?.skills || brightCVData.skills,
      languages: data?.languages || brightCVData.languages,
      certifications: data?.certifications || brightCVData.certifications,
      projects: data?.projects || brightCVData.projects,
      publications: data?.publications || brightCVData.publications,
      awards: data?.awards || brightCVData.awards,
      volunteer: data?.volunteer || brightCVData.volunteer,
      interests: data?.interests || brightCVData.interests,
      references: data?.references || brightCVData.references,
      customSections: data?.customSections || brightCVData.customSections,
      customization: data?.customization || {
        templateId: BRIGHT_OS_TEMPLATE_ID,
        colors: {
          primary: brightTemplateColors.primary,
          secondary: brightTemplateColors.secondary,
          text: brightTemplateColors.text,
          headings: brightTemplateColors.headings,
          background: brightTemplateColors.background,
          dividers: '#e5e5e5',
        },
        typography: {
          headingFont: brightTypography.headingFont,
          bodyFont: brightTypography.fontFamily,
          headingSize: brightTypography.headingSize,
          bodySize: brightTypography.bodySize,
          lineHeight: brightTypography.lineHeight,
          letterSpacing: 0,
        },
        spacing: {
          margins: { top: 30, right: 30, bottom: 30, left: 30 },
          sectionGap: 20,
          itemGap: 10,
        },
        layout: {
          sections: [
            { type: 'personal', title: 'Informations personnelles', isVisible: true, order: 0, showIcon: true },
            { type: 'summary', title: 'Résumé professionnel', isVisible: true, order: 1, showIcon: true },
            { type: 'experience', title: 'Expériences', isVisible: true, order: 2, showIcon: true },
            { type: 'education', title: 'Formation', isVisible: true, order: 3, showIcon: true },
            { type: 'skills', title: 'Compétences', isVisible: true, order: 4, showIcon: true, columns: 2 },
            { type: 'projects', title: 'Projets', isVisible: true, order: 5, showIcon: true },
            { type: 'languages', title: 'Langues', isVisible: true, order: 6, showIcon: true },
            { type: 'interests', title: 'Centres d\'intérêt', isVisible: true, order: 7, showIcon: true },
          ],
          sidebarSections: [],
          hasSidebar: false,
          sidebarPosition: 'right',
          headerStyle: 'centered',
          dateFormat: 'MMM YYYY',
          showPageNumbers: false,
        },
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        version: 1,
      },
      isPaid: true, // Admin CV is always paid
    };

    return this.cvRepository.create(cv);
  }

  async updatePersonalInfo(personalInfo: Partial<CV['personalInfo']>): Promise<CV> {
    const cv = await this.getPersonalCV();
    if (!cv) {
      return this.createOrUpdatePersonalCV({ personalInfo: { ...brightCVData.personalInfo, ...personalInfo } });
    }
    return this.cvRepository.update({
      ...cv,
      personalInfo: { ...cv.personalInfo, ...personalInfo },
      metadata: { ...cv.metadata, updatedAt: new Date() },
    });
  }

  async updateSummary(summary: string): Promise<CV> {
    const cv = await this.getPersonalCV();
    if (!cv) {
      return this.createOrUpdatePersonalCV({ summary });
    }
    return this.cvRepository.update({
      ...cv,
      summary,
      metadata: { ...cv.metadata, updatedAt: new Date() },
    });
  }

  async updateExperiences(experiences: CV['experiences']): Promise<CV> {
    const cv = await this.getPersonalCV();
    if (!cv) {
      return this.createOrUpdatePersonalCV({ experiences });
    }
    return this.cvRepository.update({
      ...cv,
      experiences,
      metadata: { ...cv.metadata, updatedAt: new Date() },
    });
  }

  async updateEducation(education: CV['education']): Promise<CV> {
    const cv = await this.getPersonalCV();
    if (!cv) {
      return this.createOrUpdatePersonalCV({ education });
    }
    return this.cvRepository.update({
      ...cv,
      education,
      metadata: { ...cv.metadata, updatedAt: new Date() },
    });
  }

  async updateSkills(skills: CV['skills']): Promise<CV> {
    const cv = await this.getPersonalCV();
    if (!cv) {
      return this.createOrUpdatePersonalCV({ skills });
    }
    return this.cvRepository.update({
      ...cv,
      skills,
      metadata: { ...cv.metadata, updatedAt: new Date() },
    });
  }

  async updateProjects(projects: CV['projects']): Promise<CV> {
    const cv = await this.getPersonalCV();
    if (!cv) {
      return this.createOrUpdatePersonalCV({ projects });
    }
    return this.cvRepository.update({
      ...cv,
      projects,
      metadata: { ...cv.metadata, updatedAt: new Date() },
    });
  }

  async updateLanguages(languages: CV['languages']): Promise<CV> {
    const cv = await this.getPersonalCV();
    if (!cv) {
      return this.createOrUpdatePersonalCV({ languages });
    }
    return this.cvRepository.update({
      ...cv,
      languages,
      metadata: { ...cv.metadata, updatedAt: new Date() },
    });
  }

  async updateSection<K extends keyof CV>(section: K, data: CV[K]): Promise<CV> {
    const cv = await this.getPersonalCV();
    if (!cv) {
      return this.createOrUpdatePersonalCV({ [section]: data } as Partial<CV>);
    }
    return this.cvRepository.update({
      ...cv,
      [section]: data,
      metadata: { ...cv.metadata, updatedAt: new Date() },
    });
  }

  getPersonalCVId(): string {
    return PERSONAL_CV_ID;
  }

  getTemplateId(): string {
    return BRIGHT_OS_TEMPLATE_ID;
  }
}
