import type { Request, Response, NextFunction } from 'express';
import type { AdminAuthUseCase } from '../../application/use-cases/index.js';
import { UnauthorizedError, ForbiddenError } from '../../shared/errors/index.js';
import type { AdminRole } from '../../domain/entities/index.js';

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      adminRole?: AdminRole;
    }
  }
}

export function createAdminAuthMiddleware(authUseCase: AdminAuthUseCase) {
  return (requiredRoles?: AdminRole[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new UnauthorizedError('Missing or invalid authorization header');
        }

        const token = authHeader.substring(7);
        const decoded = authUseCase.verifyToken(token);

        if (!decoded) {
          throw new UnauthorizedError('Invalid or expired token');
        }

        if (requiredRoles && requiredRoles.length > 0) {
          if (!requiredRoles.includes(decoded.role as AdminRole)) {
            throw new ForbiddenError('Insufficient permissions');
          }
        }

        req.adminId = decoded.adminId;
        req.adminRole = decoded.role as AdminRole;

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}
