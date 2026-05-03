import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import logger from '../config/logger';

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: 'Validation failed',
      issues: error.flatten(),
    });
    return;
  }

  logger.error('Unhandled request error', { error });
  response.status(500).json({
    message: 'Internal server error',
  });
}
