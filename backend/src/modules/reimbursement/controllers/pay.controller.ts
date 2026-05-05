import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { RequestAction, RequestStatus } from "@prisma/client"
import { AppError } from "../../../errors/AppError"

export async function payRequestController(req: Request, res: Response) {
  const { id } = req.params
  const user = req.user!

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id }
  })

  if (!request) { //verifica a existencia 
    throw new AppError("Solicitação não encontrada", 404)
  }

  if (request.status !== RequestStatus.APROVADO) { //impede pagamento indevido
    throw new AppError("Apenas solicitações APROVADAS podem ser pagas", 400)
  }

  const updatedRequest = await prisma.reimbursementRequest.update({
    where: { id },
    data: {
      status: RequestStatus.PAGO //atualiza status
    }
  })

  await prisma.requestHistory.create({
    data: {
      requestId: id,
      userId: user.id,
      action: RequestAction.PAID, //rastreabilidade
      observation: "Solicitação paga"
    }
  })

  return res.status(200).json(updatedRequest)
}