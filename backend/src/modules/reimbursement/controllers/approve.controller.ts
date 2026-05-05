import { Request, Response } from "express"
import { RequestAction, RequestStatus } from "@prisma/client"
import { prisma } from "../../../lib/prisma"
import { AppError } from "../../../errors/AppError"

export async function approveRequestController(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user!

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id }
  })

  if (!request) {
    throw new AppError("Solicitação não encontrada", 404)
  }

  if (request.status !== RequestStatus.ENVIADO) {
    throw new AppError("Apenas solicitações ENVIADAS podem ser aprovadas", 400)
  }

  const updatedRequest = await prisma.reimbursementRequest.update({
    where: { id },
    data: {
      status: RequestStatus.APROVADO
    }
  })

  await prisma.requestHistory.create({
    data: {
      requestId: id,
      userId: user.id,
      action: RequestAction.APPROVED,
      observation: "Solicitação aprovada"
    }
  })

  return res.status(200).json(updatedRequest)
}