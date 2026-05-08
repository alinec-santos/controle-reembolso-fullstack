import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../api/api"
import type { Reimbursement } from "../types/reimbursement"
import type { Category } from "../types"
import { ReimbursementInfo } from "../components/reimbursement/ReimbursementInfo"
import { HistoryModal } from "../components/reimbursement/Historymodal"
import { EditReimbursementModal } from "../components/reimbursement/EditReimbursementModal"
import { RejectReimbursementModal } from "../components/reimbursement/RejectReimbursementModal"

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
    <path d="m15 18-6-6 6-6"/>
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)

function convertBrazilianDateToInputDate(date: string) {
  const [day, month, year] = date.split("/")

  if (!day || !month || !year) {
    return date
  }

  return `${year}-${month}-${day}`
}

export function ReimbursementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [request, setRequest] = useState<Reimbursement | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  async function loadRequest() {
    try {
      setLoading(true)
      setError("")

      const response = await api.get(`/reimbursements/${id}`)

      setRequest(response.data)
    } catch {
      setError("Não foi possível carregar os detalhes da solicitação.")
    } finally {
      setLoading(false)
    }
  }

  async function loadCategories() {
    try {
      const response = await api.get("/categories")

      setCategories(response.data)
    } catch {
      setError("Erro ao carregar categorias")
    }
  }

  function handleOpenEditModal() {
    setEditModalOpen(true)
  }

  function handleCloseEditModal() {
    setEditModalOpen(false)
  }

  async function handleUpdateRequest(data: {
    categoryId: string
    description: string
    amount: number
    expenseDate: string 
  }) {
    if (!request) return

    try {
      setActionLoading(true)
      setError("")

      await api.put(`/reimbursements/${request.id}`, data)
      handleCloseEditModal()

      await loadRequest()
    } catch {
      setError("Erro ao editar solicitação")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleSubmitRequest() {
    if (!request) return

    try {
        setActionLoading(true)
        setError("")
        setSuccessMessage("")

        await api.post(`/reimbursements/${request.id}/submit`)

        setSuccessMessage("Solicitação enviada com sucesso.")

        await loadRequest()
    } catch {
        setError("Erro ao enviar solicitação")
    } finally {
        setActionLoading(false)
    }
  }

  async function handleCancelRequest() {
    if (!request) return

    try {
        setActionLoading(true)
        setError("")

        await api.post(`/reimbursements/${request.id}/cancel`)

        await loadRequest()
    } catch {
        setError("Erro ao cancelar solicitação")
    } finally {
        setActionLoading(false)
    }
  }

  async function handleApproveRequest() {
    if (!request) return

    try {
        setActionLoading(true)
        setError("")

        await api.post(`/reimbursements/${request.id}/approve`)

        await loadRequest()
    } catch {
        setError("Erro ao aprovar solicitação")
    } finally {
        setActionLoading(false)
    }
  }

  function handleCloseRejectModal() {
    setRejectModalOpen(false)
  }

  async function handleRejectRequest(reason: string) {
    if (!request) return

    try {
      setActionLoading(true)
      setError("")
      setSuccessMessage("")

      await api.post(`/reimbursements/${request.id}/reject`, {
        reason,
      })

      setSuccessMessage("Solicitação rejeitada com sucesso.")

      handleCloseRejectModal()

      await loadRequest()
    } catch {
      setError("Erro ao rejeitar solicitação")
    } finally {
      setActionLoading(false)
    }
  }
  
  async function handlePayRequest() {
    if (!request) return

    try {
      setActionLoading(true)
      setError("")
      setSuccessMessage("")

      await api.post(`/reimbursements/${request.id}/pay`)

      setSuccessMessage("Solicitação paga com sucesso.")

      await loadRequest()
    } catch {
      setError("Erro ao pagar solicitação")
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    loadRequest()
    loadCategories()
  }, [id])

  if (loading) return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/30 flex items-center justify-center">
      <p className="text-gray-500 font-medium">Carregando solicitação...</p>
    </div>
  )

  if (error) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-8 font-sans">
        <p className="mb-4 text-red-500">{error}</p>
        <button 
          type="button" 
          onClick={() => navigate("/")}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm font-medium hover:bg-gray-50"
        >
          Voltar
        </button>
      </main>
    )
  }

  if (!request) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-8 font-sans">
        <p className="mb-4 text-gray-500">Solicitação não encontrada.</p>
        <button 
          type="button" 
          onClick={() => navigate("/")}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm font-medium hover:bg-gray-50"
        >
          Voltar
        </button>
      </main>
    )
  }

  const actionsSlot = (
    <div className="flex flex-col gap-6 mt-4 lg:mt-0 items-center lg:items-end w-full">
      <button
        type="button"
        onClick={() => setHistoryModalOpen(true)}
        className="w-full py-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-slate-800 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        Visualizar histórico
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>

      {((user?.role === "COLABORADOR" && (request.status === "RASCUNHO" || request.status === "ENVIADO"))) && (
        <button
          type="button"
          onClick={handleCancelRequest}
          disabled={actionLoading}
          className="text-slate-500 hover:text-red-600 font-medium text-sm flex items-center justify-center gap-2 transition-colors focus:outline-none"
        >
          <TrashIcon />
          {actionLoading ? "Cancelando..." : "Cancelar solicitação"}
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50/30">
      <main className="max-w-5xl mx-auto px-6 py-8 font-sans">
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-md text-green-800 font-medium">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => navigate("/")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <ArrowLeftIcon />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Detalhe da solicitação</h1>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === "COLABORADOR" && request.status === "RASCUNHO" && (
              <>
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="px-6 py-2 border border-[#C13227] text-[#C13227] rounded-md shadow-sm text-sm font-bold bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  disabled={actionLoading}
                  className="bg-[#C13227] hover:bg-[#a62b21] text-white px-6 py-2 rounded-md font-bold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2 disabled:opacity-50"
                >
                  {actionLoading ? "Enviando..." : "Enviar solicitação"}
                </button>
              </>
            )}

            {user?.role === "GESTOR" && request.status === "ENVIADO" && (
              <>
                <button
                  type="button"
                  onClick={handleApproveRequest}
                  disabled={actionLoading}
                  className="px-6 py-2 border border-[#C13227] text-[#C13227] rounded-md shadow-sm text-sm font-bold bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors"
                >
                  {actionLoading ? "Aprovando..." : "Aprovar"}
                </button>
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={actionLoading}
                  className="bg-[#C13227] hover:bg-[#a62b21] text-white px-6 py-2 rounded-md font-bold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2 disabled:opacity-50"
                >
                  Rejeitar
                </button>
              </>
            )}

            {user?.role === "FINANCEIRO" && request.status === "APROVADO" && (
              <button
                type="button"
                onClick={handlePayRequest}
                disabled={actionLoading}
                className="bg-[#C13227] hover:bg-[#a62b21] text-white px-6 py-2 rounded-md font-bold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2 disabled:opacity-50"
              >
                {actionLoading ? "Pagando..." : "Marcar como paga"}
              </button>
            )}
          </div>
        </div>

        <ReimbursementInfo request={request} actionsSlot={actionsSlot} />

        <HistoryModal
          open={historyModalOpen}
          histories={request.histories}
          onClose={() => setHistoryModalOpen(false)}
        />

        <EditReimbursementModal
          open={editModalOpen}
          categories={categories}
          actionLoading={actionLoading}
          categoryId={request.category?.id ?? ""}
          description={request.description}
          amount={String(request.amount)}
          expenseDate={convertBrazilianDateToInputDate(request.expenseDate)}
          attachments={request.attachments}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateRequest}
        />

        <RejectReimbursementModal
          open={rejectModalOpen}
          actionLoading={actionLoading}
          onClose={handleCloseRejectModal}
          onSubmit={handleRejectRequest}
        />
      </main>
    </div>
  )
}