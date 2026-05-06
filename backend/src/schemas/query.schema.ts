// Schema usado para validar filtros de listagem de solicitações.
// O status é opcional, mas quando enviado precisa ser um valor válido do enum RequestStatus.
import { z } from "zod"
import { RequestStatus } from "@prisma/client"

export const listRequestsQuerySchema = z.object({
  status: z.nativeEnum(RequestStatus).optional()
})