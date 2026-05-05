import { Request, Response } from "express"
import { RequestStatus, UserRole } from "@prisma/client"
import { ZodError } from "zod"
import { prisma } from "../../../lib/prisma"
import { createAttachmentSchema } from "../schemas/create-attachment.schema"

export async function createAttachmentController(req: Request, res: Response) {
  try {
    const { id } = req.params
    const user = req.user!

    const data = createAttachmentSchema.parse(req.body)

    const request = await prisma.reimbursementRequest.findUnique({
      where: { id }
    })

    if (!request) {
      return res.status(404).json({ message: "Solicitação não encontrada" })
    }

    if (user.role === UserRole.COLABORADOR && request.userId !== user.id) {
      return res.status(403).json({ message: "Usuário sem permissão" })
    }

    if (request.status !== RequestStatus.RASCUNHO) {
      return res.status(400).json({
        message: "Anexos só podem ser adicionados em solicitações em RASCUNHO"
      })
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