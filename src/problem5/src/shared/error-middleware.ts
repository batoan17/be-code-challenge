import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import logger from '../config/logger';
import { HttpError } from './http-error';

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

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  logger.error('Unhandled request error', { error });
  response.status(500).json({
    message: 'Internal server error',
  });
}
