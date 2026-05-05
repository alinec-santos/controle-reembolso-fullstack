import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { RequestAction, RequestStatus } from "@prisma/client"
import { AppError } from "../../../errors/AppError"

export async function cancelRequestController(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user!

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id }
  })

  if (!request) {
    throw new AppError("Solicitação não encontrada", 404)
  }

  if (request.userId !== user.id) {
    throw new AppError("Usuário sem permissão", 403)
  }

  if (
    request.status !== RequestStatus.RASCUNHO &&
    request.status !== RequestStatus.ENVIADO
  ) {
    throw new AppError(
      "Só é possível cancelar solicitações em RASCUNHO ou ENVIADO",
      400
    )
  }

  const updatedRequest = await prisma.reimbursementRequest.update({
    where: { id },
    data: {
      status: RequestStatus.CANCELADO
    }
  })

  await prisma.requestHistory.create({
    data: {
      requestId: id,
      userId: user.id,
      action: RequestAction.CANCELED,
      observation: "Solicitação cancelada"
    }
  })

  return res.status(200).json(updatedRequest)
}