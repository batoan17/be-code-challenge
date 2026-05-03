import type { NextFunction, Request, Response } from 'express';
import { healthUseCases } from '../../usecases';

export async function getHealth(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await healthUseCases.checkHealth();
    response.status(result.statusCode).json(result.body);
  } catch (error) {
    next(error);
  }
}
