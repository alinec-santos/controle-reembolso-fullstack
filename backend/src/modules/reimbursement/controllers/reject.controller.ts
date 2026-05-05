import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { RequestAction, RequestStatus } from "@prisma/client"
import { rejectRequestSchema } from "../schemas/reject.schema"
import { ZodError } from "zod"

export async function rejectRequestController(req: Request, res: Response) {
  try {
    const { id } = req.params
    const user = req.user!

    const data = rejectRequestSchema.parse(req.body)

    const request = await prisma.reimbursementRequest.findUnique({
      where: { id }
    })

    if (!request) {
      return res.status(404).json({ message: "Solicitação não encontrada" })
    }

    if (request.status !== RequestStatus.ENVIADO) {
      return res.status(400).json({
        message: "Apenas solicitações ENVIADAS podem ser rejeitadas"
      })
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
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message ?? "Dados inválidos"
      })
    }

    return res.status(500).json({
      message: "Erro interno ao rejeitar solicitação"
    })
  }
}