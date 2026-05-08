import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const attachmentSchema = z.object({
  fileName: z.string().min(3, "Nome do arquivo deve ter pelo menos 3 caracteres"),
  fileType: z.string().min(2, "Informe o tipo do arquivo"),
  fileUrl: z.string().url("Informe uma URL válida"),
})

export type AttachmentFormData = z.infer<typeof attachmentSchema>

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: AttachmentFormData) => void
}

const PaperclipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C13227] transform -rotate-45">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CloudUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 mb-2">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
)

export function AttachModal({
  open,
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
      fileType: "Comprovante (PDF/Imagem)",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <PaperclipIcon />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Adicionar Anexo</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6">
          <form id="attach-form" onSubmit={handleSubmit(submit)} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="fileName" className="text-base font-semibold text-slate-800">Nome do anexo</label>
              <input
                id="fileName"
                type="text"
                placeholder="Ex: Recibo do Uber, Nota Fiscal..."
                className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
                {...register("fileName")}
              />
              {errors.fileName && <p className="text-sm text-red-500 font-medium">{errors.fileName.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="fileType" className="text-base font-semibold text-slate-800">Tipo do arquivo</label>
              <select
                id="fileType"
                className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm cursor-pointer"
                {...register("fileType")}
              >
                <option value="Comprovante (PDF/Imagem)">Comprovante (PDF/Imagem)</option>
                <option value="Nota Fiscal">Nota Fiscal</option>
                <option value="Outro">Outro</option>
              </select>
              {errors.fileType && <p className="text-sm text-red-500 font-medium">{errors.fileType.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="fileUrl" className="text-base font-semibold text-slate-800">URL do arquivo</label>
              <input
                id="fileUrl"
                type="text"
                placeholder="https://drive.google.com/file/..."
                className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
                {...register("fileUrl")}
              />
              {errors.fileUrl && <p className="text-sm text-red-500 font-medium">{errors.fileUrl.message}</p>}
            </div>


          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 border border-[#C13227] text-[#C13227] rounded-md shadow-sm text-base font-bold bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="attach-form"
            className="bg-[#C13227] hover:bg-[#a62b21] text-white px-6 py-2.5 rounded-md font-bold text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <CheckIcon />
            Salvar Anexo
          </button>
        </div>
      </div>
    </div>
  )
}