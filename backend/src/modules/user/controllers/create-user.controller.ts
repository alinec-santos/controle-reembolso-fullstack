import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { prisma } from "../../../lib/prisma"
import { createUserSchema } from "../schemas/create-user.schema"
import { AppError } from "../../../errors/AppError"

export async function createUserController(req: Request, res: Response) {
  const data = createUserSchema.parse(req.body)

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (userAlreadyExists) {
    throw new AppError("Email já cadastrado", 409)
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      role: data.role
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return res.status(201).json(user)
}