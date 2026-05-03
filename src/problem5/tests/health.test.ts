import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('GET /health', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.DATABASE_URL =
      'mysql://root:root@localhost:3306/my_node_server';
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

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'UP',
      service: 'crude-server',
      database: 'connected',
    });
  });
});
