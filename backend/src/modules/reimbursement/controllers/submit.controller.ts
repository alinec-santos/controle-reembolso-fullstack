import { Request, Response } from "express"
import { RequestStatus, RequestAction } from "@prisma/client"
import { prisma } from "../../../lib/prisma"
import { AppError } from "../../../errors/AppError"
export async function submitRequestController(req: Request, res: Response) {
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

  if (request.status !== RequestStatus.RASCUNHO) {
    throw new AppError("Apenas solicitações em RASCUNHO podem ser enviadas para análise", 400)
  }

  const updatedRequest = await prisma.reimbursementRequest.update({
    where: { id },
    data: {
      status: RequestStatus.ENVIADO
    }
  })

  await prisma.requestHistory.create({
    data: {
      requestId: id,
      userId: user.id,
      action: RequestAction.SUBMITTED,
      observation: "Solicitação enviada para análise"
    }
  })

  return res.status(200).json(updatedRequest)
}