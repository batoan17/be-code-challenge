import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFilters,
} from '../domain/user';
import { userRepository } from '../infrastructure/repositories';

export async function createUser(input: CreateUserInput): Promise<User> {
  return userRepository.createUser(input);
}

export async function listUsers(filters: UserFilters): Promise<User[]> {
  return userRepository.listUsers(filters);
}

export async function getUserById(id: string): Promise<User> {
  return userRepository.getUserById(id);
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<User> {
  return userRepository.updateUser(id, input);
}

export async function deleteUser(id: string): Promise<void> {
  return userRepository.deleteUser(id);
}
