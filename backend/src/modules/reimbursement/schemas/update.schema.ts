import { z } from "zod"

export const updateRequestSchema = z.object({
  categoryId: z.string(),
  description: z.string().min(3),
  amount: z.number().positive(),
  expenseDate: z.string()
})

//nao colocamos ststus pq o usuario nao pode editar manualmente