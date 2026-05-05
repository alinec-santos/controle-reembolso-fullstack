import { Request, Response } from "express"
import { RequestAction, RequestStatus } from "@prisma/client"
import { prisma } from "../../../lib/prisma"
import { AppError } from "../../../errors/AppError"
import { rejectRequestSchema } from "../schemas/reject.schema"

export async function rejectRequestController(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user!

  const data = rejectRequestSchema.parse(req.body)

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id }
  })

  if (!request) {
    throw new AppError("Solicitação não encontrada", 404)
  }

  if (request.status !== RequestStatus.ENVIADO) {
    throw new AppError("Apenas solicitações ENVIADAS podem ser rejeitadas", 400)
  }

  const updatedRequest = await prisma.reimbursementRequest.update({
    where: { id },
    data: {
      status: RequestStatus.REJEITADO,
      rejectionReason: data.reason
    }
  })

  await prisma.requestHistory.create({
    data: {
      requestId: id,
      userId: user.id,
      action: RequestAction.REJECTED,
      observation: data.reason
    }
  })

  return res.status(200).json(updatedRequest)
}