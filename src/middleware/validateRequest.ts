import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import logger from '../utils/logger';

/**
 * Validates request body against a Zod schema.
 * Throws ZodError on validation failure (caught by errorHandler).
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Schema validation failed', {
          path: req.path,
          issues: error.issues.map(i => i.message)
        });
      }
      next(error);
    }
  };
};