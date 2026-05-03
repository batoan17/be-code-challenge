import type { NextFunction, Request, Response } from 'express';
import type { User } from '../../domain/user';
import {
  createUserBodySchema,
  listUsersQuerySchema,
  updateUserBodySchema,
  userIdParamsSchema,
} from '../validators/user.validator';
import { userUseCases } from '../../usecases';

function toUserResponse(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function createUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = createUserBodySchema.parse(request.body);
    const user = await userUseCases.createUser(body);

    response.status(201).json({
      data: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = listUsersQuerySchema.parse(request.query);
    const users = await userUseCases.listUsers(query);

    response.json({
      data: users.map(toUserResponse),
    });
  } catch (error) {
    next(error);
  }
}

export async function getUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = userIdParamsSchema.parse(request.params);
    const user = await userUseCases.getUserById(id);

    response.json({
      data: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = userIdParamsSchema.parse(request.params);
    const body = updateUserBodySchema.parse(request.body);
    const user = await userUseCases.updateUser(id, body);

    response.json({
      data: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = userIdParamsSchema.parse(request.params);
    await userUseCases.deleteUser(id);

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}
