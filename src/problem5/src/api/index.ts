// This file is the entry point for the API in Vercel
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../app';

const appPromise = createApp();

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const app = await appPromise;

  return app(request, response);
}
