import { Request, Response } from "express"
import { RequestStatus, UserRole } from "@prisma/client"
import { prisma } from "../../../lib/prisma"
import { formatDate, formatDateTime } from "../../../lib/formatDate"

export async function showRequestController(req: Request, res: Response) {
  const { id } = req.params // pega o id que vem da URL
  const user = req.user! // pega o usuario autenticado

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id }, // busca uma unica solicitacao pelo ID
    include: {
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      attachments: true,
      histories: {
        orderBy: {
          createdAt: "asc"
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
        }
      }
    }
  })

  if (!request) {
    return res.status(404).json({ message: "Solicitação não encontrada" })
  }

  // validamos permissao aqui porque nao basta o usuario estar logado.
  // Se um colaborador tentar acessar com id de outra pessoa, sem a validacao ele veria dados de outro colaborador
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

  return res.status(200).json({
    ...request,
    expenseDate: formatDate(request.expenseDate),
    createdAt: formatDateTime(request.createdAt),
    updatedAt: formatDateTime(request.updatedAt),
    histories: request.histories.map((history) => ({
      ...history,
      createdAt: formatDateTime(history.createdAt),
      updatedAt: formatDateTime(history.updatedAt)
    }))
  })
}