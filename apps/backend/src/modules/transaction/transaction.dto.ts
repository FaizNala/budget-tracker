import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  userId: z.string().uuid(),
  categoryId: z.number().int().positive(),
  amount: z.number().positive(),
  description: z.string().max(500).optional(),
  transactionDate: z.string().datetime(),
});

export const UpdateTransactionSchema = z.object({
  userId: z.string().uuid().optional(),
  categoryId: z.number().int().positive().optional(),
  amount: z.number().positive().optional(),
  description: z.string().max(500).optional(),
  transactionDate: z.string().datetime().optional(),
});

export const TransactionResponseSchema = z.object({
  id: z.number(),
  userId: z.string().uuid(),
  categoryId: z.number(),
  amount: z.number(),
  description: z.string().nullable(),
  transactionDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;
