import { Request, Response } from "express"
import { prisma } from "../../../lib/prisma"
import { AppError } from "../../../errors/AppError"
import { createRequestSchema } from "../schemas/create.schema"
import { formatDateTime, parseDate } from "../../../lib/formatDate"

export async function createRequestController(req: Request, res: Response) {
  // 1. Validação de Perfil: Verifica se o usuário é um COLABORADOR
  // Ajuste a string "COLABORADOR" para o valor exato que você usa no seu Enum do Prisma
  if (req.user?.role !== "COLABORADOR") {
    throw new AppError("Apenas colaboradores podem criar solicitações de reembolso.", 403)
  }

  const data = createRequestSchema.parse(req.body)

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId }
  })

  if (!category || !category.active) {
    throw new AppError("Categoria inválida ou inativa", 400)
  }

  // 2. Criação da solicitação vinculada ao ID do colaborador logado
  const request = await prisma.reimbursementRequest.create({
    data: {
      userId: req.user!.id,
      categoryId: data.categoryId,
      description: data.description,
      amount: data.amount,
      expenseDate: parseDate(data.expenseDate) 
    }
  })

  // 3. Registro no histórico
  await prisma.requestHistory.create({
    data: {
      requestId: request.id,
      userId: req.user!.id,
      action: "CREATED",
      observation: "Solicitação criada"
    }
  })

  return res.status(201).json({
    ...request,
    expenseDate: formatDateTime(request.expenseDate),
    createdAt: formatDateTime(request.createdAt),
    updatedAt: formatDateTime(request.updatedAt)
  })
}