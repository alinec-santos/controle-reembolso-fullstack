import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { createRequestSchema } from "../schemas/create.schema"

export async function createRequestController(req: Request, res: Response) {
  try {
    const data = createRequestSchema.parse(req.body) // aqui validamos o body. Se vier errado, a requisiçao para 

    const request = await prisma.reimbursementRequest.create({ //salvamos a solicitacao no banco
      data: {
        userId: req.user!.id, // aqui pegamos o usuario autenticado pelo token
        categoryId: data.categoryId,
        description: data.description,
        amount: data.amount,
        expenseDate: new Date(data.expenseDate)
      }
    })

    return res.status(201).json(request)
    } catch (error) {
    console.error(error)

    return res.status(400).json({
      message: "Erro ao criar solicitação"
    })
    }
}