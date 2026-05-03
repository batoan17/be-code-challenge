import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid user id');

const userNameSchema = z.string().trim().min(1).max(100);

const userEmailSchema = z
  .string()
  .trim()
  .email()
  .max(254)
  .transform((email) => email.toLowerCase());

export const userIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const createUserBodySchema = z
  .object({
    name: userNameSchema,
    email: userEmailSchema,
  })
  .strict();

export const updateUserBodySchema = z
  .object({
    name: userNameSchema.optional(),
    email: userEmailSchema.optional(),
  })
  .strict()
  .refine((body) => body.name !== undefined || body.email !== undefined, {
    message: 'At least one field must be provided',
  });

export const listUsersQuerySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().min(1).optional(),
  })
  .strict();
