import type { AppSettings } from '../entities/AppSettings.js';

export interface IAppSettingsRepository {
  get(): Promise<AppSettings>;
  update(settings: Partial<AppSettings>, updatedBy?: string): Promise<AppSettings>;
}
