import { Request, Response } from "express"
import { RequestAction, RequestStatus } from "@prisma/client"
import { prisma } from "../../../lib/prisma"

export async function approveRequestController(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user!

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id }
  })

  if (!request) {
    return res.status(404).json({ message: "Solicitação não encontrada" })
  }

  if (request.status !== RequestStatus.ENVIADO) {
    return res.status(400).json({
      message: "Apenas solicitações ENVIADAS podem ser aprovadas"
    })
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