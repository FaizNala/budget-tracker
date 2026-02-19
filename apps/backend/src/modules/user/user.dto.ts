import { z } from 'zod';

export const UserRoleEnum = z.enum(['admin', 'user']);

export const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  password: z.string().min(6).max(100),
  role: UserRoleEnum.default('user'),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(6).max(100).optional(),
  role: UserRoleEnum.optional(),
});

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: UserRoleEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserRole = z.infer<typeof UserRoleEnum>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
