import type { Request, Response, NextFunction } from 'express';
import { generateSessionId } from '../../shared/utils/index.js';

declare global {
  namespace Express {
    interface Request {
      sessionId: string;
    }
  }
}

export function sessionHandler(req: Request, res: Response, next: NextFunction): void {
  let sessionId = req.headers['x-session-id'] as string;

  if (!sessionId) {
    sessionId = generateSessionId();
    res.setHeader('X-Session-Id', sessionId);
  }

  req.sessionId = sessionId;
  next();
}
