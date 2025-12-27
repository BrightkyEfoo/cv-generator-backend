import type { PrismaClient } from '@prisma/client';
import type { IAppSettingsRepository } from '../../domain/interfaces/index.js';
import type { AppSettings } from '../../domain/entities/index.js';

const DEFAULT_SETTINGS_ID = 'app_settings';

export class PrismaAppSettingsRepository implements IAppSettingsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async get(): Promise<AppSettings> {
    let settings = await this.prisma.appSettings.findUnique({
      where: { id: DEFAULT_SETTINGS_ID },
    });

    // Create default settings if not exists
    if (!settings) {
      settings = await this.prisma.appSettings.create({
        data: {
          id: DEFAULT_SETTINGS_ID,
          freeDownloads: process.env.FREE_DOWNLOADS === 'true',
        },
      });
    }

    return {
      id: settings.id,
      freeDownloads: settings.freeDownloads,
      updatedAt: settings.updatedAt,
      updatedBy: settings.updatedBy || undefined,
    };
  }

  async update(data: Partial<AppSettings>, updatedBy?: string): Promise<AppSettings> {
    const settings = await this.prisma.appSettings.upsert({
      where: { id: DEFAULT_SETTINGS_ID },
      update: {
        ...(data.freeDownloads !== undefined && { freeDownloads: data.freeDownloads }),
        updatedBy,
      },
      create: {
        id: DEFAULT_SETTINGS_ID,
        freeDownloads: data.freeDownloads ?? false,
        updatedBy,
      },
    });

    return {
      id: settings.id,
      freeDownloads: settings.freeDownloads,
      updatedAt: settings.updatedAt,
      updatedBy: settings.updatedBy || undefined,
    };
  }
}
