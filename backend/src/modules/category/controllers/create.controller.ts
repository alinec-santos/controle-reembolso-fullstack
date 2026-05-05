import { Request, Response } from "express"
import { ZodError } from "zod"
import { prisma } from "../../../lib/prisma"
import { categorySchema } from "../schemas/category.schema"

export async function createCategoryController(req: Request, res: Response) {
  try {
    const data = categorySchema.parse(req.body)

    const category = await prisma.category.create({
      data: {
        name: data.name,
        active: data.active ?? true
      }
    })

    return res.status(201).json(category)
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message ?? "Dados inválidos"
      })
    }

    return res.status(500).json({
      message: "Erro interno ao criar categoria"
    })
  }
}