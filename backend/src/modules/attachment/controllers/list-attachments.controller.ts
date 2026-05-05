import { Request, Response } from "express"
import { RequestStatus, UserRole } from "@prisma/client"
import { prisma } from "../../../lib/prisma"

export async function listAttachmentsController(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user!

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id }
  })

  if (!request) {
    return res.status(404).json({ message: "Solicitação não encontrada" })
  }

  if (user.role === UserRole.COLABORADOR && request.userId !== user.id) {
    return res.status(403).json({ message: "Usuário sem permissão" })
  }

  if (user.role === UserRole.GESTOR && request.status !== RequestStatus.ENVIADO) {
    return res.status(403).json({ message: "Usuário sem permissão" })
  }

  if (
    user.role === UserRole.FINANCEIRO &&
    request.status !== RequestStatus.APROVADO &&
    request.status !== RequestStatus.PAGO
  ) {
    return res.status(403).json({ message: "Usuário sem permissão" })
  }

  const attachments = await prisma.attachment.findMany({
    where: {
      requestId: id
    },
    orderBy: {
      createdAt: "asc"
    }
  })

  return res.status(200).json(attachments)
}