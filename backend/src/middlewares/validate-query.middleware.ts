// Middleware genérico para validar query params usando Zod.
// Query params são valores enviados após ? na URL, como /reimbursements?status=ENVIADO.
import { Request, Response, NextFunction } from "express"
import { ZodSchema } from "zod"

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req.query)
    return next()
  }
}