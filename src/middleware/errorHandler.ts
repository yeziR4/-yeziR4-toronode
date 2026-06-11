import { Request, Response, NextFunction } from 'express';
import { APIException, NetworkException, ValidationException } from 'torosdk';
import logger from '../utils/logger';
import { ApiErrorResponse } from '../types';

/**
 * Centralized error handler.
 * Maps ToroNet SDK exceptions to clean HTTP responses.
 * Never leaks stack traces or sensitive data in production.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();

  // Log error with request context (excluding sensitive body fields)
  logger.error('Request error', {
    path: req.path,
    method: req.method,
    errorName: err.name,
    errorMessage: err.message,
    // Never log request body — may contain passwords or keys
  });

  // SDK API Exception — bad response from Toronet server
  if (err instanceof APIException) {
    const statusCode = (err as any).statusCode || 502;
    const response: ApiErrorResponse = {
      error: 'TORONET_API_ERROR',
      message: err.message || 'The Toronet API returned an error',
      timestamp
    };
    res.status(statusCode).json(response);
    return;
  }

  // Network Exception — connectivity failure
  if (err instanceof NetworkException) {
    const response: ApiErrorResponse = {
      error: 'NETWORK_ERROR',
      message: 'Unable to reach the Toronet network. Please retry later.',
      timestamp
    };
    res.status(503).json(response);
    return;
  }

  // Validation Exception — invalid parameters
  if (err instanceof ValidationException) {
    const response: ApiErrorResponse = {
      error: 'VALIDATION_ERROR',
      message: err.message || 'Invalid request parameters',
      timestamp
    };
    res.status(400).json(response);
    return;
  }

  // Zod validation errors (from validateRequest middleware)
  if (err.name === 'ZodError') {
    const response: ApiErrorResponse = {
      error: 'SCHEMA_VALIDATION_ERROR',
      message: err.message,
      timestamp
    };
    res.status(400).json(response);
    return;
  }

  // Generic fallback — internal server error
  const isDev = process.env.NODE_ENV === 'development';
  const response: ApiErrorResponse = {
    error: 'INTERNAL_ERROR',
    message: isDev ? err.message : 'An unexpected error occurred',
    timestamp
  };

  res.status(500).json(response);
};

/**
 * Handle 404 routes.
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
};