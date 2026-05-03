import type { NextFunction, Request, Response } from 'express';

import { checkHealth } from '../../usecases/check-health';

export async function getHealth(
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await checkHealth();
    response.status(result.statusCode).json(result.body);
  } catch (error) {
    next(error);
  }
}
