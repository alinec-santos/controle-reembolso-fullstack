import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"

export async function listCategoriesController(req: Request, res: Response) {
  const categories = await prisma.category.findMany({ //busca varias categorias no banco
    where: {
      active: true //retorna apenas categorias ativas
    },
    orderBy: {
      name: "asc" //ordena por nome em ordem alfabetica
    }
  })

  return res.status(200).json(categories)
}