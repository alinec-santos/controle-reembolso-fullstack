import { z } from "zod"
import { RequestStatus } from "@prisma/client"

export const listRequestsQuerySchema = z.object({
  status: z.nativeEnum(RequestStatus).optional()
})