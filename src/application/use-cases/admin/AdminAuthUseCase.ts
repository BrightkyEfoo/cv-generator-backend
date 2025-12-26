import { createHash } from 'crypto';
import type { IAdminRepository } from '../../../domain/interfaces/index.js';
import type { AdminLoginDto, AdminLoginResponseDto } from '../../dtos/index.js';
import { UnauthorizedError } from '../../../shared/errors/index.js';

export class AdminAuthUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly jwtSecret: string
  ) {}

  async login(dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    const admin = await this.adminRepository.findByEmail(dto.email);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const passwordHash = this.hashPassword(dto.password);
    if (passwordHash !== admin.passwordHash) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = this.generateToken(admin.id, admin.role);

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  verifyToken(token: string): { adminId: string; role: string } | null {
    try {
      const [header, payload, signature] = token.split('.');
      const expectedSignature = this.sign(`${header}.${payload}`);

      if (signature !== expectedSignature) {
        return null;
      }

      const data = JSON.parse(Buffer.from(payload, 'base64url').toString());

      if (data.exp && Date.now() > data.exp) {
        return null;
      }

      return { adminId: data.sub, role: data.role };
    } catch {
      return null;
    }
  }

  private hashPassword(password: string): string {
    return createHash('sha256').update(password + this.jwtSecret).digest('hex');
  }

  private generateToken(adminId: string, role: string): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      sub: adminId,
      role,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })).toString('base64url');

    const signature = this.sign(`${header}.${payload}`);
    return `${header}.${payload}.${signature}`;
  }

  private sign(data: string): string {
    return createHash('sha256').update(data + this.jwtSecret).digest('base64url');
  }

  hashPasswordForCreate(password: string): string {
    return this.hashPassword(password);
  }
}
