import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const apiKey = 'test-api-key-1234567890abcdef1234567890';

describe('GET /docs', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.DATABASE_URL = 'mongodb://localhost:27017/crude_server_test';
    process.env.API_KEY = apiKey;
  });

  afterEach(async () => {
    const prismaModule = await import('../src/infrastructure/prisma/prisma');
    await prismaModule.default.$disconnect();
  });

  it('serves the Swagger UI API docs', async () => {
    const { createApp } = await import('../src/app');
    const app = await createApp();

    const response = await request(app).get('/docs/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('swagger-ui');
    expect(response.text).toContain('A Crude Server API Docs');
  });

  it('pre-authorizes Swagger UI with the configured API key', async () => {
    const { createApp } = await import('../src/app');
    const app = await createApp();

    const response = await request(app).get('/docs/swagger-ui-init.js');

    expect(response.status).toBe(200);
    expect(response.text).toContain('preauthorizeApiKey');
    expect(response.text).toContain(apiKey);
  });

  it('documents API key authentication', async () => {
    const { createApp } = await import('../src/app');
    const app = await createApp();

    const response = await request(app).get('/docs/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.security).toEqual([{ ApiKeyAuth: [] }]);
    expect(response.body.components.securitySchemes.ApiKeyAuth).toEqual({
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
      description: 'API key required to call protected endpoints.',
    });
  });
});
