import { Request, Response } from "express"
import { ZodError } from "zod"
import { prisma } from "../../../lib/prisma"
import { categorySchema } from "../schemas/category.schema"

export async function updateCategoryController(req: Request, res: Response) {
  try {
    const { id } = req.params
    const data = categorySchema.parse(req.body)

    const categoryExists = await prisma.category.findUnique({
      where: { id }
    })

    if (!categoryExists) {
      return res.status(404).json({ message: "Categoria não encontrada" })
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        active: data.active ?? categoryExists.active
      }
    })

    return res.status(200).json(category)
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message ?? "Dados inválidos"
      })
    }

    return res.status(500).json({
      message: "Erro interno ao atualizar categoria"
    })
  }
}