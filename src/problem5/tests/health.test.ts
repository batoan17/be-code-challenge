import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const apiKey = 'test-api-key-1234567890abcdef1234567890';

describe('GET /health', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.DATABASE_URL = 'mongodb://localhost:27017/crude_server_test';
    process.env.API_KEY = apiKey;
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    const prismaModule = await import('../src/infrastructure/prisma/prisma');
    await prismaModule.default.$disconnect();
  });

  it('returns the generated service name when the database is reachable', async () => {
    const prismaModule = await import('../src/infrastructure/prisma/prisma');
    vi.spyOn(prismaModule.default, '$runCommandRaw').mockResolvedValue([
      { ok: 1 },
    ] as never);

    const { createApp } = await import('../src/app');
    const app = await createApp();

    const response = await request(app).get('/health').set('x-api-key', apiKey);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'UP',
      service: 'crude-server',
      database: 'connected',
    });
  });

  it('rejects requests without an API key', async () => {
    const { createApp } = await import('../src/app');
    const app = await createApp();

    const response = await request(app).get('/health');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing API key',
    });
  });
});
