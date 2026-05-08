import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { Category } from "../types"
import { getApiErrorMessage } from "../utils/getApiErrorMessage"
import { AttachModal, type AttachmentFormData } from "../components/reimbursement/Attachmodal"

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 hover:text-slate-800 transition-colors">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
)

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
)

const PaperclipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-45">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

const createReimbursementSchema = z.object({
  categoryId: z.string().min(1, "Selecione uma categoria"),
  description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  expenseDate: z.string().min(1, "Informe a data da despesa"),
})

type CreateReimbursementFormData = z.infer<typeof createReimbursementSchema>

export function CreateReimbursement() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [attachments, setAttachments] = useState<AttachmentFormData[]>([])
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false)

  const canCreateRequest = user?.role === "COLABORADOR"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReimbursementFormData>({
    resolver: zodResolver(createReimbursementSchema),
    defaultValues: {
      categoryId: "",
      description: "",
      amount: 0,
      expenseDate: "",
    },
  })

  async function loadCategories() {
    try {
      const response = await api.get("/categories")
      setCategories(response.data)
    } catch (error) {
      setError(getApiErrorMessage(error, "Erro ao carregar categorias"))
    }
  }

  useEffect(() => {
    if (!canCreateRequest) {
      navigate("/")
      return
    }

    loadCategories()
  }, [canCreateRequest, navigate])

  async function onSubmit(data: CreateReimbursementFormData) {
    if (!canCreateRequest) {
      setError("Você não tem permissão para criar solicitações.")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const payload = {
        categoryId: data.categoryId,
        description: data.description,
        amount: data.amount,
        expenseDate: data.expenseDate,
      }

      const response = await api.post("/reimbursements", payload)
      
      const newId = response.data.id

      if (attachments.length > 0) {
        for (const attachment of attachments) {
          await api.post(`/reimbursements/${newId}/attachments`, attachment)
        }
      }

      navigate("/")
    } catch (error) {
      setError(getApiErrorMessage(error, "Erro ao criar solicitação"))
    } finally {
      setIsLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans">
      <header className="flex items-center justify-between px-6 md:px-8 py-5 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src="/pitang-logo.png"
            alt="Pitang"
            className="h-9 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
          <span className="text-[#C13227] font-semibold text-base md:text-lg border-l border-gray-300 pl-4">Dashboard</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-gray-700 hidden sm:block">Olá, {user?.name}!</span>
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-lg font-bold border border-gray-200 shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <button
            onClick={logout}
            className="text-gray-500 hover:text-[#C13227] transition-colors flex items-center gap-2 text-base font-medium"
            title="Sair"
          >
            <LogoutIcon /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-[1000px] mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            title="Voltar"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">Nova solicitação</h1>
        </div>

        <div className="bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-base font-bold text-slate-700">Categoria</label>
              <select
                id="categoryId"
                className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm cursor-pointer"
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
              <label htmlFor="description" className="text-base font-bold text-slate-700">Descrição</label>
              <input
                id="description"
                type="text"
                className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
                placeholder="Descreva a despesa (ex: Almoço com cliente)"
                {...register("description")}
              />
              {errors.description && <p className="text-sm text-red-500 font-medium">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-base font-bold text-slate-700">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base font-medium">R$</span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    className="flex h-12 w-full rounded-md border border-slate-300 bg-white pl-11 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
                    placeholder="0,00"
                    {...register("amount")}
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-500 font-medium">{errors.amount.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="expenseDate" className="text-base font-bold text-slate-700">Data da despesa</label>
                <input
                  id="expenseDate"
                  type="date"
                  max={today}
                  className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
                  {...register("expenseDate")}
                />
                {errors.expenseDate && <p className="text-sm text-red-500 font-medium">{errors.expenseDate.message}</p>}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">Anexos</h3>
                <button
                  type="button"
                  onClick={() => setIsAttachModalOpen(true)}
                  className="px-4 py-2 border border-[#C13227] text-[#C13227] rounded-md shadow-sm text-sm font-semibold bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors flex items-center gap-2"
                >
                  <PaperclipIcon />
                  Adicionar anexo
                </button>
              </div>

              <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-gray-50/50">
                {attachments.length === 0 ? (
                  <>
                    <FileIcon />
                    <p className="text-sm text-slate-500 font-medium">Nenhum anexo adicionado ainda.</p>
                    <p className="text-sm text-slate-500">Clique no botão acima para anexar comprovantes.</p>
                  </>
                ) : (
                  <ul className="w-full text-left space-y-2">
                    {attachments.map((att, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded-md">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800">{att.fileName}</span>
                          <span className="text-xs text-slate-500">{att.fileType}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <hr className="my-8 border-gray-200" />

            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-6 py-3 border-2 border-[#C13227] text-[#C13227] rounded-md shadow-sm text-base font-bold bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-[#C13227] hover:bg-[#a62b21] text-white px-8 py-3 border-2 border-[#C13227] hover:border-[#a62b21] rounded-md font-bold text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? "Salvando..." : (
                  <>
                    <SaveIcon />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <AttachModal
        open={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
        onSubmit={(data) => {
          setAttachments(prev => [...prev, data])
          setIsAttachModalOpen(false)
        }}
      />
    </div>
  )
}