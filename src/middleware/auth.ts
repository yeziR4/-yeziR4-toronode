import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * API Key authentication for admin/sensitive endpoints.
 * Compares X-API-Key header against ADMIN_API_KEY env var.
 * Returns 401 if missing or invalid.
 */
export const requireApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const providedKey = req.headers['x-api-key'];
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    logger.error('API_KEY not configured in environment');
    res.status(500).json({
      error: 'CONFIGURATION_ERROR',
      message: 'Server API key not configured',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (!providedKey || providedKey !== expectedKey) {
    logger.warn('Unauthorized API access attempt', {
      path: req.path,
      ip: req.ip,
      keyProvided: !!providedKey
    });
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Valid API key required in X-API-Key header',
      timestamp: new Date().toISOString()
    });
    return;
  }

  next();
};