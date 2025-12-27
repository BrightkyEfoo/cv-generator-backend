import type { Request, Response } from 'express';
import type { CreateCVUseCase, UpdateCVUseCase, GetCVUseCase, ExportCVUseCase } from '../../application/use-cases/index.js';
import type { CVResponseDto } from '../../application/dtos/index.js';
import type { CV } from '../../domain/entities/index.js';

export class CVController {
  constructor(
    private readonly createCVUseCase: CreateCVUseCase,
    private readonly updateCVUseCase: UpdateCVUseCase,
    private readonly getCVUseCase: GetCVUseCase,
    private readonly exportCVUseCase: ExportCVUseCase
  ) {}

  private toResponseDto(cv: CV): CVResponseDto {
    return {
      id: cv.id,
      sessionId: cv.sessionId,
      title: cv.title,
      personalInfo: cv.personalInfo,
      summary: cv.summary,
      objective: cv.objective,
      experiences: cv.experiences,
      education: cv.education,
      skills: cv.skills,
      languages: cv.languages,
      certifications: cv.certifications,
      projects: cv.projects,
      publications: cv.publications,
      awards: cv.awards,
      volunteer: cv.volunteer,
      interests: cv.interests,
      references: cv.references,
      customSections: cv.customSections,
      customization: cv.customization,
      isPaid: cv.isPaid,
      createdAt: cv.metadata.createdAt.toISOString(),
      updatedAt: cv.metadata.updatedAt.toISOString(),
    };
  }

  async create(req: Request, res: Response): Promise<void> {
    const cv = await this.createCVUseCase.execute({
      sessionId: req.sessionId,
      title: req.body.title || 'My CV',
      templateId: req.body.templateId,
    });
    res.status(201).json(this.toResponseDto(cv));
  }

  async getById(req: Request, res: Response): Promise<void> {
    const cv = await this.getCVUseCase.getById(req.params.id);
    res.json(this.toResponseDto(cv));
  }

  async getBySession(req: Request, res: Response): Promise<void> {
    const cv = await this.getCVUseCase.getBySessionId(req.sessionId);
    res.json(this.toResponseDto(cv));
  }

  async updatePersonalInfo(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updatePersonalInfo({
      cvId: req.params.id,
      personalInfo: req.body.personalInfo,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateSummary(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateSummary({
      cvId: req.params.id,
      summary: req.body.summary,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateObjective(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateObjective({
      cvId: req.params.id,
      objective: req.body.objective,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateExperiences(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateExperiences({
      cvId: req.params.id,
      experiences: req.body.experiences,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateEducation(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateEducation({
      cvId: req.params.id,
      education: req.body.education,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateSkills(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateSkills({
      cvId: req.params.id,
      skills: req.body.skills,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateLanguages(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateLanguages({
      cvId: req.params.id,
      languages: req.body.languages,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateCertifications(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateCertifications({
      cvId: req.params.id,
      certifications: req.body.certifications,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateProjects(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateProjects({
      cvId: req.params.id,
      projects: req.body.projects,
    });
    res.json(this.toResponseDto(cv));
  }

  async updatePublications(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updatePublications({
      cvId: req.params.id,
      publications: req.body.publications,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateAwards(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateAwards({
      cvId: req.params.id,
      awards: req.body.awards,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateVolunteer(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateVolunteer({
      cvId: req.params.id,
      volunteer: req.body.volunteer,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateInterests(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateInterests({
      cvId: req.params.id,
      interests: req.body.interests,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateReferences(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateReferences({
      cvId: req.params.id,
      references: req.body.references,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateCustomSections(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateCustomSections({
      cvId: req.params.id,
      customSections: req.body.customSections,
    });
    res.json(this.toResponseDto(cv));
  }

  async updateCustomization(req: Request, res: Response): Promise<void> {
    const cv = await this.updateCVUseCase.updateCustomization({
      cvId: req.params.id,
      customization: req.body.customization,
    });
    res.json(this.toResponseDto(cv));
  }

  async preview(req: Request, res: Response): Promise<void> {
    const pdf = await this.exportCVUseCase.generatePreview(req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="cv-preview.pdf"');
    res.send(pdf);
  }

  async previewImage(req: Request, res: Response): Promise<void> {
    const image = await this.exportCVUseCase.generatePreviewImage(req.params.id);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(image);
  }

  async download(req: Request, res: Response): Promise<void> {
    const pdf = await this.exportCVUseCase.generateDownload(req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    res.send(pdf);
  }
}
