import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { loginSchema } from "../schemas/login.schema"

export async function loginController(req: Request, res: Response) {
  try {
    // validação de entrada
    const data = loginSchema.parse(req.body)

    // buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" })
    }

    // compara senha digitada com hash
    const passwordMatch = await bcrypt.compare(data.password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais inválidas" })
    }

    // cria token de autenticaçao
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    )

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    return res.status(400).json({ message: "Erro na requisição" })
  }
}