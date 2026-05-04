import { timingSafeEqual } from 'node:crypto';

import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';
import { HttpError } from './http-error';

const apiKeyHeader = 'x-api-key';

function isApiKeyValid(apiKey: string | undefined): boolean {
  if (!apiKey) {
    return false;
  }

  const providedKey = Buffer.from(apiKey);
  const expectedKey = Buffer.from(env.API_KEY);

  return (
    providedKey.length === expectedKey.length &&
    timingSafeEqual(providedKey, expectedKey)
  );
}

export function apiKeyAuthMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  if (!isApiKeyValid(request.get(apiKeyHeader))) {
    next(new HttpError(401, 'Invalid or missing API key'));
    return;
  }

  next();
}

