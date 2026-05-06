import { Request, Response } from "express"
import { RequestStatus, UserRole } from "@prisma/client"
import { prisma } from "../../../lib/prisma"

export async function historyRequestController(req: Request, res: Response) {
  const { id } = req.params //pega o id da solicitacao da URL
  const user = req.user!

  const request = await prisma.reimbursementRequest.findUnique({ //busca a solicitaçao antes do historico 
    where: { id }
  })

  if (!request) {
    return res.status(404).json({ message: "Solicitação não encontrada" })
  }

  if (user.role === UserRole.COLABORADOR && request.userId !== user.id) {
    return res.status(403).json({ message: "Usuário sem permissão" })
  }

  if (
  user.role === UserRole.GESTOR &&
  request.status !== RequestStatus.ENVIADO &&
  request.status !== RequestStatus.APROVADO &&
  request.status !== RequestStatus.REJEITADO
  ) {
    return res.status(403).json({ message: "Usuário sem permissão" })
  }

  if (
    user.role === UserRole.FINANCEIRO &&
    request.status !== RequestStatus.APROVADO &&
    request.status !== RequestStatus.PAGO
  ) {
    return res.status(403).json({ message: "Usuário sem permissão" })
  }

  const history = await prisma.requestHistory.findMany({ //busca todos os registros de historico ligados a solicitacao
    where: {
      requestId: id
    },
    include: {
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
      createdAt: "asc"
    }
  })

  return res.status(200).json(history)
}