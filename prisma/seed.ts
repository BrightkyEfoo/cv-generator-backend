import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

const templatesDir = join(__dirname, '../src/infrastructure/templates/edges');
const previewsDir = join(__dirname, '../public/previews');

type TemplateCategory = 'professional' | 'creative' | 'modern' | 'simple' | 'academic';

interface TemplateConfig {
  fileName: string;
  name: string;
  description: string;
  category: TemplateCategory;
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
    background: string;
    text: string;
    headings: string;
  };
  availableFonts: string[];
}

const templateConfigs: TemplateConfig[] = [
  {
    fileName: 'corporate-red',
    name: 'Corporate Red',
    description: 'Professional template with dark sidebar and red accents, ideal for corporate positions',
    category: 'professional',
    features: {
      hasPhoto: true,
      hasSidebar: true,
      hasColorCustomization: true,
      hasFontCustomization: true,
      maxSections: 15,
    },
    defaultColors: {
      primary: '#c0392b',
      secondary: '#3d3d3d',
      background: '#ffffff',
      text: '#333333',
      headings: '#2c3e50',
    },
    availableFonts: ['Segoe UI', 'Georgia', 'Arial', 'Times New Roman'],
  },
  {
    fileName: 'dark-tech',
    name: 'Dark Tech',
    description: 'Modern dark theme with teal accents, perfect for tech and IT professionals',
    category: 'modern',
    features: {
      hasPhoto: true,
      hasSidebar: false,
      hasColorCustomization: true,
      hasFontCustomization: true,
      maxSections: 15,
    },
    defaultColors: {
      primary: '#00bcd4',
      secondary: '#1a2634',
      background: '#1a2634',
      text: '#ffffff',
      headings: '#ffffff',
    },
    availableFonts: ['Segoe UI', 'Roboto', 'Arial'],
  },
  {
    fileName: 'purple-modern',
    name: 'Purple Modern',
    description: 'Contemporary card-based design with purple theme, great for creative tech roles',
    category: 'modern',
    features: {
      hasPhoto: true,
      hasSidebar: false,
      hasColorCustomization: true,
      hasFontCustomization: true,
      maxSections: 15,
    },
    defaultColors: {
      primary: '#9b59b6',
      secondary: '#2d2a5e',
      background: '#2d2a5e',
      text: '#ccccdd',
      headings: '#ffffff',
    },
    availableFonts: ['Segoe UI', 'Roboto', 'Arial'],
  },
  {
    fileName: 'cyan-professional',
    name: 'Cyan Professional',
    description: 'Clean two-column layout with cyan header, suitable for business professionals',
    category: 'professional',
    features: {
      hasPhoto: true,
      hasSidebar: false,
      hasColorCustomization: true,
      hasFontCustomization: true,
      maxSections: 15,
    },
    defaultColors: {
      primary: '#00838f',
      secondary: '#006064',
      background: '#ffffff',
      text: '#333333',
      headings: '#006064',
    },
    availableFonts: ['Segoe UI', 'Arial', 'Calibri'],
  },
  {
    fileName: 'gradient-dark',
    name: 'Gradient Dark',
    description: 'Modern dark theme with gradient accents, ideal for designers and developers',
    category: 'creative',
    features: {
      hasPhoto: true,
      hasSidebar: true,
      hasColorCustomization: true,
      hasFontCustomization: true,
      maxSections: 15,
    },
    defaultColors: {
      primary: '#6366f1',
      secondary: '#1e1e2e',
      background: '#1e1e2e',
      text: '#a0a0b0',
      headings: '#ffffff',
    },
    availableFonts: ['Segoe UI', 'Inter', 'Roboto'],
  },
  {
    fileName: 'classic-clean',
    name: 'Classic Clean',
    description: 'Timeless minimalist design with elegant typography, perfect for traditional industries',
    category: 'simple',
    features: {
      hasPhoto: false,
      hasSidebar: false,
      hasColorCustomization: true,
      hasFontCustomization: true,
      maxSections: 12,
    },
    defaultColors: {
      primary: '#2c3e50',
      secondary: '#34495e',
      background: '#ffffff',
      text: '#333333',
      headings: '#2c3e50',
    },
    availableFonts: ['Georgia', 'Times New Roman', 'Garamond', 'Palatino'],
  },
  {
    fileName: 'teal-sidebar',
    name: 'Teal Sidebar',
    description: 'Professional layout with teal sidebar for contact and skills, great for experienced professionals',
    category: 'professional',
    features: {
      hasPhoto: true,
      hasSidebar: true,
      hasColorCustomization: true,
      hasFontCustomization: true,
      maxSections: 15,
    },
    defaultColors: {
      primary: '#008080',
      secondary: '#006666',
      background: '#ffffff',
      text: '#333333',
      headings: '#008080',
    },
    availableFonts: ['Segoe UI', 'Arial', 'Calibri', 'Verdana'],
  },
  {
    fileName: 'orange-creative',
    name: 'Orange Creative',
    description: 'Vibrant creative design with orange accents and unique skill visualization',
    category: 'creative',
    features: {
      hasPhoto: true,
      hasSidebar: true,
      hasColorCustomization: true,
      hasFontCustomization: true,
      maxSections: 15,
    },
    defaultColors: {
      primary: '#e67e22',
      secondary: '#d35400',
      background: '#ffffff',
      text: '#333333',
      headings: '#e67e22',
    },
    availableFonts: ['Segoe UI', 'Arial', 'Open Sans'],
  },
];

function loadEdgeCode(fileName: string): string {
  const filePath = join(templatesDir, `${fileName}.edge`);
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Failed to load template: ${fileName}`, error);
    return '';
  }
}

async function seedTemplates() {
  console.log('Seeding templates...');

  for (const config of templateConfigs) {
    const edgeCode = loadEdgeCode(config.fileName);

    if (!edgeCode) {
      console.warn(`Skipping template ${config.name}: edge file not found`);
      continue;
    }

    const templateId = `template-${config.fileName}`;

    await prisma.template.upsert({
      where: { id: templateId },
      update: {
        name: config.name,
        description: config.description,
        category: config.category,
        edgeCode,
        features: config.features,
        defaultColors: config.defaultColors,
        availableFonts: config.availableFonts,
        isActive: true,
      },
      create: {
        id: templateId,
        name: config.name,
        description: config.description,
        category: config.category,
        edgeCode,
        features: config.features,
        defaultColors: config.defaultColors,
        availableFonts: config.availableFonts,
        isActive: true,
      },
    });

    console.log(`  Created/Updated template: ${config.name}`);
  }
}

async function seedAdmin() {
  console.log('Seeding admin user...');

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const jwtSecret = process.env.ADMIN_JWT_SECRET || 'default-secret';
  const passwordHash = createHash('sha256')
    .update(adminPassword + jwtSecret)
    .digest('hex');

  await prisma.adminUser.upsert({
    where: { email: 'admin@cvgenerator.com' },
    update: {},
    create: {
      email: 'admin@cvgenerator.com',
      passwordHash,
      name: 'Admin',
      role: 'superadmin',
      isActive: true,
    },
  });

  console.log('  Created admin user: admin@cvgenerator.com');
}

async function generatePreviews() {
  console.log('Generating template previews...');

  if (!existsSync(previewsDir)) {
    mkdirSync(previewsDir, { recursive: true });
    console.log(`  Created previews directory: ${previewsDir}`);
  }

  try {
    const { TemplatePreviewGenerator } = await import(
      '../src/infrastructure/services/TemplatePreviewGenerator.js'
    );

    const generator = new TemplatePreviewGenerator(previewsDir);
    const results = await generator.generateAllPreviews();

    for (const result of results) {
      if (result.success) {
        const templateId = `template-${result.templateName}`;

        await prisma.template.update({
          where: { id: templateId },
          data: { previewUrl: result.previewPath },
        });

        console.log(`  Generated preview for: ${result.templateName}`);
      } else {
        console.error(`  Failed to generate preview for: ${result.templateName} - ${result.error}`);
      }
    }

    await generator.closeBrowser();
  } catch (error) {
    console.error('Failed to generate previews:', error);
    console.log('  Previews will be generated on first request');
  }
}

async function main() {
  console.log('Starting database seed...\n');

  await seedTemplates();
  console.log('');

  await seedAdmin();
  console.log('');

  await generatePreviews();
  console.log('');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
