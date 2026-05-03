import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('GET /docs', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.DATABASE_URL = 'mysql://root:root@localhost:3306/test_db';
  });

  afterEach(async () => {
    const prismaModule = await import('../src/infrastructure/prisma/prisma');
    await prismaModule.default.$disconnect();
  });

  it('serves the human-readable API docs', async () => {
    const { createApp } = await import('../src/app');
    const app = await createApp();

    const response = await request(app).get('/docs');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('A Crude Server API Docs');
  });

  it('serves the OpenAPI JSON document', async () => {
    const { createApp } = await import('../src/app');
    const app = await createApp();

    const response = await request(app).get('/docs/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.3');
    expect(response.body.paths).toHaveProperty('/health');
  });
});
