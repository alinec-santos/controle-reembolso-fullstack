import { Request, Response } from "express"
import { RequestStatus, RequestAction } from "@prisma/client"
import { prisma } from "../../../lib/prisma"

export async function submitRequestController(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user!

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id }
  })

  if (!request) {
    return res.status(404).json({ message: "Solicitação não encontrada" })
  }

  if (request.userId !== user.id) {
    return res.status(403).json({ message: "Usuário sem permissão" })
  }

  if (request.status !== RequestStatus.RASCUNHO) {
    return res.status(400).json({
      message: "Apenas solicitações em RASCUNHO podem ser enviadas para análise"
    })
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