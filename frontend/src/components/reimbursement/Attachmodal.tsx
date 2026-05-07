import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const attachmentSchema = z.object({
  fileName: z
    .string()
    .min(3, "Nome do arquivo deve ter pelo menos 3 caracteres"),

  fileType: z
    .string()
    .min(2, "Informe o tipo do arquivo"),

  fileUrl: z
    .string()
    .url("Informe uma URL válida"),
})

type AttachmentFormData = z.infer<typeof attachmentSchema>

type Props = {
  open: boolean
  actionLoading: boolean
  onClose: () => void
  onSubmit: (data: AttachmentFormData) => void
}

export function AttachModal({
  open,
  actionLoading,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttachmentFormData>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: {
      fileName: "",
      fileType: "",
      fileUrl: "",
    },
  })

  if (!open) return null

  function handleClose() {
    reset()
    onClose()
  }

  function submit(data: AttachmentFormData) {
    onSubmit(data)

    reset()
  }

  return (
    <div>
      <h3>Adicionar anexo</h3>

      <form onSubmit={handleSubmit(submit)}>
        <div>
          <label htmlFor="fileName">Nome do arquivo</label>

          <input
            id="fileName"
            type="text"
            {...register("fileName")}
          />

          {errors.fileName && <p>{errors.fileName.message}</p>}
        </div>

        <div>
          <label htmlFor="fileType">Tipo do arquivo</label>

          <input
            id="fileType"
            type="text"
            placeholder="pdf, png, jpg..."
            {...register("fileType")}
          />

          {errors.fileType && <p>{errors.fileType.message}</p>}
        </div>

        <div>
          <label htmlFor="fileUrl">URL do arquivo</label>

          <input
            id="fileUrl"
            type="text"
            {...register("fileUrl")}
          />

          {errors.fileUrl && <p>{errors.fileUrl.message}</p>}
        </div>

        <button type="button" onClick={handleClose}>
          Cancelar
        </button>

        <button type="submit" disabled={actionLoading}>
          {actionLoading ? "Salvando..." : "Adicionar anexo"}
        </button>
      </form>
    </div>
  )
}