import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
})

//usamos para validar a entrada antes da logca e evitar dados invalidos chegarem no banco