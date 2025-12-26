import type { Request, Response, NextFunction } from 'express';

export const apiKeyHandler = (req: Request, res: Response, next: NextFunction): void => {
  // Skip API key check for health endpoint, webhooks, and static files
  if (
    req.path === '/api/health' ||
    req.path.startsWith('/api/webhooks') ||
    req.path.startsWith('/previews') ||
    req.path.startsWith('/uploads')
  ) {
    next();
    return;
  }

  // Get API key from header OR query parameter (for iframes/direct links)
  const apiKey = (req.headers['x-api-key'] as string) || (req.query.api_key as string);
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
