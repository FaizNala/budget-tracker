import { z } from 'zod';

export const CategoryTypeEnum = z.enum(['income', 'expense']);

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: CategoryTypeEnum.default('expense'),
  userId: z.string().uuid().optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: CategoryTypeEnum.optional(),
  userId: z.string().uuid().optional(),
});

export const CategoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: CategoryTypeEnum,
  userId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CategoryType = z.infer<typeof CategoryTypeEnum>;
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
