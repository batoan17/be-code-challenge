import { Prisma, User as PrismaUser } from '@prisma/client';
import {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFilters,
} from '../../domain/user';
import { HttpError } from '../../shared/http-error';
import prisma from '../prisma/prisma';

function toDomainUser(user: PrismaUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function rethrowUserPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new HttpError(409, 'A user with this email already exists');
    }

    if (error.code === 'P2025') {
      throw new HttpError(404, 'User not found');
    }
  }

  throw error;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  try {
    const user = await prisma.user.create({
      data: input,
    });

    return toDomainUser(user);
  } catch (error) {
    rethrowUserPrismaError(error);
  }
}

export async function listUsers(filters: UserFilters): Promise<User[]> {
  const where: Prisma.UserWhereInput = {};

  if (filters.name) {
    where.name = {
      contains: filters.name,
      mode: 'insensitive',
    };
  }

  if (filters.email) {
    where.email = {
      contains: filters.email,
      mode: 'insensitive',
    };
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users.map(toDomainUser);
}

export async function getUserById(id: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return toDomainUser(user);
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<User> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: input,
    });

    return toDomainUser(user);
  } catch (error) {
    rethrowUserPrismaError(error);
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    rethrowUserPrismaError(error);
  }
}
