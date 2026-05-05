import { Request, Response } from "express"
import { RequestAction, RequestStatus } from "@prisma/client"
import { prisma } from "../../../lib/prisma"
import { updateRequestSchema } from "../schemas/update.schema"
import { AppError } from "../../../errors/AppError"

export async function updateRequestController(req: Request, res: Response) {
  const { id } = req.params //pega o id da solicitacao pela URL
  const user = req.user! //usuario autenticado pelo token

  const data = updateRequestSchema.parse(req.body) //valida o body com o zod

  const request = await prisma.reimbursementRequest.findUnique({
    where: { id } //busca no banco
  })

  if (!request) {
    throw new AppError("Solicitação não encontrada", 404)
  }

  if (request.userId !== user.id) { //garante que so o dono edite
    throw new AppError("Usuário sem permissão", 403)
  }

  if (request.status !== RequestStatus.RASCUNHO) { //garante que nao seja possivel editar depois do envio
    throw new AppError("Apenas solicitações em RASCUNHO podem ser enviadas para análise", 400)
  }

  const updatedRequest = await prisma.reimbursementRequest.update({ //atualiza os dados permitidos
    where: { id },
    data: {
      categoryId: data.categoryId,
      description: data.description,
      amount: data.amount,
      expenseDate: new Date(data.expenseDate)
    }
  })

  await prisma.requestHistory.create({ //registra no historico que a solicitaçao foi editada
    data: {
      requestId: id,
      userId: user.id,
      action: RequestAction.UPDATED,
      observation: "Solicitação editada"
    }
  })

  return res.status(200).json(updatedRequest)
}