import type { Admin } from '../entities/index.js';

export interface IAdminRepository {
  create(admin: Admin): Promise<Admin>;
  findById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  update(admin: Admin): Promise<Admin>;
  deactivate(id: string): Promise<void>;
}
