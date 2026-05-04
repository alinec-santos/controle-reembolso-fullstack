import { z } from "zod"

export const createRequestSchema = z.object({
  categoryId: z.string(),
  description: z.string().min(3),
  amount: z.number().positive(),
  expenseDate: z.string()
})