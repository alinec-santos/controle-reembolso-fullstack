import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { prisma } from "../../../lib/prisma"
import { updateUserSchema } from "../schemas/create-user.schema"
import { AppError } from "../../../errors/AppError"
import { formatDateTime } from "../../../lib/formatDate"

export async function updateUserController(req: Request, res: Response) {
  const { id } = req.params
  const data = updateUserSchema.parse(req.body)

  const userExists = await prisma.user.findUnique({
    where: {
      id
    }
  })

  if (!userExists) {
    throw new AppError("Usuário não encontrado", 404)
  }

  const emailAlreadyInUse = await prisma.user.findFirst({
    where: {
      email: data.email,
      NOT: {
        id
      }
    }
  })

  if (emailAlreadyInUse) {
    throw new AppError("Email já cadastrado", 409)
  }

  const updateData: {
    name: string
    email: string
    role: typeof data.role
    password?: string
  } = {
    name: data.name,
    email: data.email,
    role: data.role
  }

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10)
  }

  const user = await prisma.user.update({
    where: {
      id
    },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return res.status(200).json({
    ...user,
    createdAt: formatDateTime(user.createdAt),
    updatedAt: formatDateTime(user.updatedAt)
  })
}