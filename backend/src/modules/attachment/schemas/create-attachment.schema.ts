import { z } from "zod"

export const createAttachmentSchema = z.object({
  fileName: z.string().min(3, "Nome do arquivo é obrigatório"),
  fileType: z.string().min(3, "Tipo do arquivo é obrigatório"),
  fileUrl: z.string().url("URL do arquivo inválida") //precisa ser uma URL válida porque estamos simulando que o arquivo já está hospedado em algum lugar.
})