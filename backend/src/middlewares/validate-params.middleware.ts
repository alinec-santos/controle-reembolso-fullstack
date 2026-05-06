// Middleware genérico para validar parâmetros da URL usando Zod.
// Exemplo: validar se o :id recebido na rota é um UUID válido.
import { NextFunction, Request, Response } from "express"
import { ZodSchema } from "zod"

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req.params)
    return next()
  }
}
//valida se o id da url é um uuid