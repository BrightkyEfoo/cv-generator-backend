import type { Request, Response, NextFunction } from 'express';

export const apiKeyHandler = (req: Request, res: Response, next: NextFunction): void => {
  // Skip API key check for health endpoint and webhooks
  if (req.path === '/api/health' || req.path.startsWith('/api/webhooks')) {
    next();
    return;
  }

  const apiKey = req.headers['x-api-key'] as string;
  const expectedApiKey = process.env.API_KEY;

  // If no API_KEY is configured, skip validation (development mode)
  if (!expectedApiKey) {
    next();
    return;
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    res.status(401).json({ message: 'Invalid or missing API key' });
    return;
  }

  next();
};
