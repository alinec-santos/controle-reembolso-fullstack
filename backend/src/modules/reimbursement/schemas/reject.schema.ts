import { z } from "zod"

export const rejectRequestSchema = z.object({
  reason: z.string().min(5, "Justificativa deve ter pelo menos 5 caracteres")
})