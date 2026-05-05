import { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import { AppError } from "../errors/AppError"

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: error.issues[0]?.message ?? "Dados inválidos"
    })
  }

  console.error(error)

  return res.status(500).json({
    message: "Erro interno do servidor"
  })
}