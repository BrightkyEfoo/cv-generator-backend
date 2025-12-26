import type { PrismaClient, AdminUser as PrismaAdmin } from '@prisma/client';
import type { Admin } from '../../domain/entities/index.js';
import type { IAdminRepository } from '../../domain/interfaces/index.js';

export class PrismaAdminRepository implements IAdminRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(prismaAdmin: PrismaAdmin): Admin {
    return {
      id: prismaAdmin.id,
      email: prismaAdmin.email,
      passwordHash: prismaAdmin.passwordHash,
      name: prismaAdmin.name,
      role: prismaAdmin.role as Admin['role'],
      isActive: prismaAdmin.isActive,
      createdAt: prismaAdmin.createdAt,
      updatedAt: prismaAdmin.updatedAt,
    };
  }

  async create(admin: Admin): Promise<Admin> {
    const created = await this.prisma.adminUser.create({
      data: {
        id: admin.id,
        email: admin.email,
        passwordHash: admin.passwordHash,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.adminUser.findUnique({ where: { id } });
    return admin ? this.toDomain(admin) : null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.adminUser.findUnique({ where: { email } });
    return admin ? this.toDomain(admin) : null;
  }

  async update(admin: Admin): Promise<Admin> {
    const updated = await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
    return this.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.prisma.adminUser.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
