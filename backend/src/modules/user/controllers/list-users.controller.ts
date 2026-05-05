import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"

export async function listUsersController(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: {
      name: "asc"
    }
  })

  return res.status(200).json(users)
}