import { Request, Response } from "express"
import { UserRole } from "@prisma/client"
import { prisma } from "../../../lib/prisma"
import { formatDateTime } from "../../../lib/formatDate"

export async function listCategoriesController(req: Request, res: Response) {
  const user = req.user!

  const categories = await prisma.category.findMany({
    where:
      user.role === UserRole.ADMIN
        ? {}
        : {
            active: true,
          },
    orderBy: {
      name: "asc",
    },
  })

  return res.status(200).json(
    categories.map((category) => ({
      ...category,
      createdAt: formatDateTime(category.createdAt),
      updatedAt: formatDateTime(category.updatedAt),
    }))
  )
}