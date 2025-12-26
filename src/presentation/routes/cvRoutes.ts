import { Router } from 'express';
import type { CVController } from '../controllers/index.js';
import { asyncHandler } from '../middleware/index.js';

export function createCVRoutes(controller: CVController): Router {
  const router = Router();

  router.post('/', asyncHandler((req, res) => controller.create(req, res)));
  router.get('/session', asyncHandler((req, res) => controller.getBySession(req, res)));
  router.get('/:id', asyncHandler((req, res) => controller.getById(req, res)));

  router.patch('/:id/personal-info', asyncHandler((req, res) => controller.updatePersonalInfo(req, res)));
  router.patch('/:id/summary', asyncHandler((req, res) => controller.updateSummary(req, res)));
  router.patch('/:id/experiences', asyncHandler((req, res) => controller.updateExperiences(req, res)));
  router.patch('/:id/education', asyncHandler((req, res) => controller.updateEducation(req, res)));
  router.patch('/:id/skills', asyncHandler((req, res) => controller.updateSkills(req, res)));
  router.patch('/:id/languages', asyncHandler((req, res) => controller.updateLanguages(req, res)));
  router.patch('/:id/certifications', asyncHandler((req, res) => controller.updateCertifications(req, res)));
  router.patch('/:id/projects', asyncHandler((req, res) => controller.updateProjects(req, res)));
  router.patch('/:id/publications', asyncHandler((req, res) => controller.updatePublications(req, res)));
  router.patch('/:id/awards', asyncHandler((req, res) => controller.updateAwards(req, res)));
  router.patch('/:id/volunteer', asyncHandler((req, res) => controller.updateVolunteer(req, res)));
  router.patch('/:id/interests', asyncHandler((req, res) => controller.updateInterests(req, res)));
  router.patch('/:id/references', asyncHandler((req, res) => controller.updateReferences(req, res)));
  router.patch('/:id/custom-sections', asyncHandler((req, res) => controller.updateCustomSections(req, res)));
  router.patch('/:id/customization', asyncHandler((req, res) => controller.updateCustomization(req, res)));

  router.get('/:id/preview', asyncHandler((req, res) => controller.preview(req, res)));
  router.get('/:id/download', asyncHandler((req, res) => controller.download(req, res)));

  return router;
}
