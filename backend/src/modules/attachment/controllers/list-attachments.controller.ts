import { Request, Response } from "express"
import { RequestStatus, UserRole } from "@prisma/client"
import { prisma } from "../../../lib/prisma"
import { AppError } from "../../../errors/AppError"

export async function listAttachmentsController(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user!

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id }
  })

  if (!request) {
    throw new AppError("Solicitação não encontrada", 404)
  }

  if (user.role === UserRole.COLABORADOR && request.userId !== user.id) {
    throw new AppError("Usuário sem permissão", 403)
  }

  if (user.role === UserRole.GESTOR && request.status !== RequestStatus.ENVIADO) {
    throw new AppError("Usuário sem permissão", 403)
  }

  if (
    user.role === UserRole.FINANCEIRO &&
    request.status !== RequestStatus.APROVADO &&
    request.status !== RequestStatus.PAGO
  ) {
    throw new AppError("Usuário sem permissão", 403)
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