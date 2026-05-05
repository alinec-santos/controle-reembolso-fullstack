import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { ZodError } from "zod"
import { prisma } from "../../../lib/prisma"
import { createUserSchema } from "../schemas/create-user.schema"

export async function createUserController(req: Request, res: Response) {
  try {
    const data = createUserSchema.parse(req.body)

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (userAlreadyExists) {
      return res.status(409).json({ message: "Email já cadastrado" })
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
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message ?? "Dados inválidos"
      })
    }

    return res.status(500).json({
      message: "Erro interno ao criar usuário"
    })
  }
}