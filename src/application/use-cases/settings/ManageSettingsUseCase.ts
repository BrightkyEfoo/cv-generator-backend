import type { IAppSettingsRepository } from '../../../domain/interfaces/index.js';
import type { AppSettings } from '../../../domain/entities/index.js';

export class ManageSettingsUseCase {
  constructor(private readonly settingsRepository: IAppSettingsRepository) {}

  async getSettings(): Promise<AppSettings> {
    return this.settingsRepository.get();
  }

  async updateSettings(
    data: { freeDownloads?: boolean },
    adminId?: string
  ): Promise<AppSettings> {
    return this.settingsRepository.update(data, adminId);
  }

  async isFreeDownloadsEnabled(): Promise<boolean> {
    const settings = await this.settingsRepository.get();
    return settings.freeDownloads;
  }
}
