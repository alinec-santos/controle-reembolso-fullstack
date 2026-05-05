import { Request, Response } from "express"
import { RequestStatus, UserRole } from "@prisma/client"
import { ZodError } from "zod"
import { prisma } from "../../../lib/prisma"
import { createAttachmentSchema } from "../schemas/create-attachment.schema"
import { AppError } from "../../../errors/AppError"

export async function createAttachmentController(req: Request, res: Response) {
  try {
    const { id } = req.params
    const user = req.user!

    const data = createAttachmentSchema.parse(req.body)

    const request = await prisma.reimbursementRequest.findUnique({
      where: { id }
    })

    if (!request) {
      throw new AppError("Solicitação não encontrada", 404)
    }

    if (user.role === UserRole.COLABORADOR && request.userId !== user.id) {
      throw new AppError("Usuário sem permissão", 403)
    }

    if (request.status !== RequestStatus.RASCUNHO) {
        throw new AppError("Anexos só podem ser adicionados em solicitações em RASCUNHO", 400)
    }

    const attachment = await prisma.attachment.create({
      data: {
        requestId: id,
        fileName: data.fileName,
        fileType: data.fileType,
        fileUrl: data.fileUrl
      }
    })

    return res.status(201).json(attachment)
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.issues[0]?.message ?? "Dados inválidos"
      })
    }

    return res.status(500).json({
      message: "Erro interno ao adicionar anexo"
    })
  }
}