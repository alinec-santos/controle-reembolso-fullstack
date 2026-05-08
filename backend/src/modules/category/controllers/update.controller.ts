import { Request, Response } from "express"
import { ZodError } from "zod"
import { prisma } from "../../../lib/prisma"
import { categorySchema } from "../schemas/category.schema"
import { AppError } from "../../../errors/AppError"

export async function updateCategoryController(req: Request, res: Response) {
  try {
    const { id } = req.params
    const data = categorySchema.parse(req.body)

    const categoryExists = await prisma.category.findUnique({
      where: { id }
    })

    if (!categoryExists) {
      throw new AppError("Categoria não encontrada", 404)
    }

    const categories = await prisma.category.findMany()
    const nameNormalized = data.name.trim().toLowerCase()

    const categoryAlreadyExists = categories.find(
      (cat) => cat.name.trim().toLowerCase() === nameNormalized && cat.id !== id
    )

    if (categoryAlreadyExists) {
      throw new AppError("Já existe uma categoria com este nome", 409)
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

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: "Erro interno ao atualizar categoria"
    })
  }
}