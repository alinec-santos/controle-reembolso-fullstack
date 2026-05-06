// Middleware de autenticação.
// Verifica se a requisição possui um token JWT válido.
// Se o token for válido, busca o usuário no banco e adiciona seus dados em req.user.
// Isso permite que as próximas camadas saibam quem é o usuário autenticado.
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma"

type JwtPayload = {
  userId: string
  role: string
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado" })
  }

  const [, token] = authHeader.split(" ")

  if (!token) {
    return res.status(401).json({ message: "Token inválido" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload //usa a biblioteca para verificar se o token é valido

    const user = await prisma.user.findUnique({ //mesmo que o token seja valido, o usuario pode ter sido deletado do sistema. Por seguranca usamos o prisma para buscar esse usuario no bd
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" })
    }

    req.user = user //tipagem 

    return next()
  } catch {
    return res.status(401).json({ message: "Token inválido" })
  }
}