// Schema reutilizável para validar rotas que recebem :id.
// Garante que o id seja um UUID válido antes de consultar o banco.
import { z } from "zod"

export const idParamsSchema = z.object({
  id: z.string().uuid("ID inválido")
})