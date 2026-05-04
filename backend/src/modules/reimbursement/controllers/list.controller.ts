import { Request, Response } from "express"
import { RequestStatus, UserRole } from "@prisma/client"
import { prisma } from "../../../lib/prisma"

export async function listRequestsController(req: Request, res: Response) {
  const user = req.user! //pegamos o usuario autenticado - o req.user foi preenchido pelo authMiddleware

  let where = {} // se for adm lista tudo

  if (user.role === UserRole.COLABORADOR) {
    where = {
      userId: user.id
    }
  }

  if (user.role === UserRole.GESTOR) {
    where = {
      status: RequestStatus.ENVIADO
    }
  }

  if (user.role === UserRole.FINANCEIRO) {
    where = {
      status: RequestStatus.APROVADO
    }
  }

  const requests = await prisma.reimbursementRequest.findMany({
    where,
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return res.status(200).json(requests)
}