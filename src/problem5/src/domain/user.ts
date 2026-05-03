export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = Pick<User, 'name' | 'email'>;
export type UpdateUserInput = Partial<CreateUserInput>;

export interface UserFilters {
  name?: string;
  email?: string;
}
