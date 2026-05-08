import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Category } from "../../types"

const editReimbursementSchema = z.object({
  categoryId: z.string().min(1, "Selecione uma categoria"),
  description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  expenseDate: z.string().min(1, "Informe a data da despesa"),
})

type EditReimbursementFormData = z.infer<typeof editReimbursementSchema>

type Props = {
  open: boolean
  categories: Category[]
  actionLoading: boolean
  categoryId: string
  description: string
  amount: string
  expenseDate: string
  // Adicionado attachments opcionalmente para não quebrar uso anterior se omitido
  attachments?: { id: string, fileName: string, fileUrl?: string, createdAt?: string }[]
  onClose: () => void
  onSubmit: (data: EditReimbursementFormData) => void
}

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C13227]">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const PaperclipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-45">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C13227]">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
)


export function EditReimbursementModal({
  open,
  categories,
  actionLoading,
  categoryId,
  description,
  amount,
  expenseDate,
  attachments = [],
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditReimbursementFormData>({
    resolver: zodResolver(editReimbursementSchema),
    defaultValues: {
      categoryId: "",
      description: "",
      amount: 0,
      expenseDate: "",
    },
  })

  useEffect(() => {
    reset({
      categoryId,
      description,
      amount: Number(amount),
      expenseDate,
    })
  }, [categoryId, description, amount, expenseDate, reset])

  if (!open) return null

  function handleClose() {
    reset()
    onClose()
  }

  function submit(data: EditReimbursementFormData) {
    onSubmit(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <EditIcon />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Editar Solicitação</h2>
          </div>
          <button 
            type="button" 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="edit-form" onSubmit={handleSubmit(submit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="categoryId" className="text-base font-bold text-slate-800">Categoria</label>
                <select
                  id="categoryId"
                  className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm cursor-pointer"
                  {...register("categoryId")}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-sm text-red-500 font-medium">{errors.categoryId.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="expenseDate" className="text-base font-bold text-slate-800">Data da despesa</label>
                <input
                  id="expenseDate"
                  type="date"
                  className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
                  {...register("expenseDate")}
                />
                {errors.expenseDate && <p className="text-sm text-red-500 font-medium">{errors.expenseDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-base font-bold text-slate-800">Descrição</label>
              <input
                id="description"
                type="text"
                className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
                placeholder="Descreva a despesa"
                {...register("description")}
              />
              {description && <p className="text-sm text-gray-500">Valor atual: {description}</p>}
              {errors.description && <p className="text-sm text-red-500 font-medium">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-base font-bold text-slate-800">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base font-medium">R$</span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    className="flex h-11 w-full rounded-md border border-slate-300 bg-white pl-11 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
                    {...register("amount")}
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-500 font-medium">{errors.amount.message}</p>}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">Anexos</h3>
                <button
                  type="button"
                  className="px-4 py-2 border border-[#C13227] text-[#C13227] rounded-md shadow-sm text-sm font-semibold bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors flex items-center gap-2"
                >
                  <PaperclipIcon />
                  Adicionar novo
                </button>
              </div>

              {attachments.length === 0 ? (
                 <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50/50">
                    <p className="text-sm text-slate-500 font-medium">Nenhum anexo adicionado ainda.</p>
                 </div>
              ) : (
                <ul className="space-y-3">
                  {attachments.map((att, idx) => (
                    <li key={att.id || idx} className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-red-50 flex items-center justify-center shrink-0">
                          <FileTextIcon />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{att.fileName}</span>
                          <span className="text-xs text-slate-500">Adicionado em {att.createdAt || "recente"}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-[#C13227] p-2 rounded-full hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-100"
                        title="Remover anexo"
                      >
                        <TrashIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 shrink-0">
          <button 
            type="button" 
            onClick={handleClose}
            className="px-6 py-2.5 border border-[#C13227] text-[#C13227] rounded-md shadow-sm text-base font-bold bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="edit-form"
            disabled={actionLoading}
            className="bg-[#C13227] hover:bg-[#a62b21] text-white px-6 py-2.5 rounded-md font-bold text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {actionLoading ? "Salvando..." : (
              <>
                <SaveIcon />
                Editar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}