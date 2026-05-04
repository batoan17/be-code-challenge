import { Prisma } from '@prisma/client';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const userId = '6560f7f60d3f5b8f3d5c5d11';
const now = new Date('2026-05-03T00:00:00.000Z');
const apiKey = 'test-api-key-1234567890abcdef1234567890';

const user = {
  id: userId,
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: now,
  updatedAt: now,
};

function knownPrismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError('Prisma request failed', {
    code,
    clientVersion: 'test',
  });
}

async function getApp() {
  const { createApp } = await import('../src/app');
  return createApp();
}

async function getPrisma() {
  const prismaModule = await import('../src/infrastructure/prisma/prisma');
  return prismaModule.default;
}

describe('/users', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.DATABASE_URL = 'mongodb://localhost:27017/crude_server_test';
    process.env.API_KEY = apiKey;
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    const prisma = await getPrisma();
    await prisma.$disconnect();
  });

  it('creates a user', async () => {
    const prisma = await getPrisma();
    const createSpy = vi.spyOn(prisma.user, 'create').mockResolvedValue(user);
    const app = await getApp();

    const response = await request(app)
      .post('/users')
      .set('x-api-key', apiKey)
      .send({
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: {
        ...user,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    });
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });
  });

  it('returns 400 when create input is invalid', async () => {
    const prisma = await getPrisma();
    const createSpy = vi.spyOn(prisma.user, 'create');
    const app = await getApp();

    const response = await request(app)
      .post('/users')
      .set('x-api-key', apiKey)
      .send({
        name: '',
        email: 'not-an-email',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('returns 409 when create email already exists', async () => {
    const prisma = await getPrisma();
    vi.spyOn(prisma.user, 'create').mockRejectedValue(
      knownPrismaError('P2002'),
    );
    const app = await getApp();

    const response = await request(app)
      .post('/users')
      .set('x-api-key', apiKey)
      .send({
        name: 'John Doe',
        email: 'john@example.com',
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: 'A user with this email already exists',
    });
  });

  it('lists users with filters', async () => {
    const prisma = await getPrisma();
    const findManySpy = vi
      .spyOn(prisma.user, 'findMany')
      .mockResolvedValue([user]);
    const app = await getApp();

    const response = await request(app)
      .get('/users')
      .set('x-api-key', apiKey)
      .query({ name: 'ada', email: 'example' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        {
          ...user,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ],
    });
    expect(findManySpy).toHaveBeenCalledWith({
      where: {
        name: {
          contains: 'ada',
          mode: 'insensitive',
        },
        email: {
          contains: 'example',
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('gets user details', async () => {
    const prisma = await getPrisma();
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);
    const app = await getApp();

    const response = await request(app)
      .get(`/users/${userId}`)
      .set('x-api-key', apiKey);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(userId);
  });

  it('returns 404 when a user is missing', async () => {
    const prisma = await getPrisma();
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    const app = await getApp();

    const response = await request(app)
      .get(`/users/${userId}`)
      .set('x-api-key', apiKey);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'User not found',
    });
  });

  it('returns 400 for invalid user ids', async () => {
    const prisma = await getPrisma();
    const findUniqueSpy = vi.spyOn(prisma.user, 'findUnique');
    const app = await getApp();

    const response = await request(app)
      .get('/users/not-an-object-id')
      .set('x-api-key', apiKey);

    expect(response.status).toBe(400);
    expect(findUniqueSpy).not.toHaveBeenCalled();
  });

  it('updates a user', async () => {
    const prisma = await getPrisma();
    const updateSpy = vi.spyOn(prisma.user, 'update').mockResolvedValue({
      ...user,
      name: 'John Smith',
    });
    const app = await getApp();

    const response = await request(app)
      .patch(`/users/${userId}`)
      .set('x-api-key', apiKey)
      .send({
        name: 'John Smith',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe('John Smith');
    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: userId },
      data: { name: 'John Smith' },
    });
  });

  it('returns 400 when update body is empty', async () => {
    const prisma = await getPrisma();
    const updateSpy = vi.spyOn(prisma.user, 'update');
    const app = await getApp();

    const response = await request(app)
      .patch(`/users/${userId}`)
      .set('x-api-key', apiKey)
      .send({});

    expect(response.status).toBe(400);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('returns 404 when update target is missing', async () => {
    const prisma = await getPrisma();
    vi.spyOn(prisma.user, 'update').mockRejectedValue(
      knownPrismaError('P2025'),
    );
    const app = await getApp();

    const response = await request(app)
      .patch(`/users/${userId}`)
      .set('x-api-key', apiKey)
      .send({
        name: 'John Smith',
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'User not found',
    });
  });

  it('deletes a user', async () => {
    const prisma = await getPrisma();
    const deleteSpy = vi.spyOn(prisma.user, 'delete').mockResolvedValue(user);
    const app = await getApp();

    const response = await request(app)
      .delete(`/users/${userId}`)
      .set('x-api-key', apiKey);

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    expect(deleteSpy).toHaveBeenCalledWith({
      where: { id: userId },
    });
  });

  it('returns 404 when delete target is missing', async () => {
    const prisma = await getPrisma();
    vi.spyOn(prisma.user, 'delete').mockRejectedValue(
      knownPrismaError('P2025'),
    );
    const app = await getApp();

    const response = await request(app)
      .delete(`/users/${userId}`)
      .set('x-api-key', apiKey);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'User not found',
    });
  });

  it('rejects requests with an invalid API key', async () => {
    const prisma = await getPrisma();
    const findManySpy = vi.spyOn(prisma.user, 'findMany');
    const app = await getApp();

    const response = await request(app)
      .get('/users')
      .set('x-api-key', 'wrong-api-key');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid or missing API key',
    });
    expect(findManySpy).not.toHaveBeenCalled();
  });
});
