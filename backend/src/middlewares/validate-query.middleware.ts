import { Request, Response, NextFunction } from "express"
import { ZodSchema } from "zod"

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req.query)
    return next()
  }
}