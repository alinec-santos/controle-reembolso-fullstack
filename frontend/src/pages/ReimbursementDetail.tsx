import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../api/api"
import type { Reimbursement } from "../types/reimbursement"
import type { Category } from "../types"
import { ReimbursementInfo } from "../components/reimbursement/ReimbursementInfo"
import { AttachmentsSection } from "../components/reimbursement/ReimbursementAttachments"
import { HistorySection } from "../components/reimbursement/ReimbursementHistory"
import { ReimbursementActions } from "../components/reimbursement/ReimbursementActions"
import { AttachModal } from "../components/reimbursement/Attachmodal"
import { HistoryModal } from "../components/reimbursement/Historymodal"
import { EditReimbursementModal } from "../components/reimbursement/EditReimbursementModal"

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

  const [attachModalOpen, setAttachModalOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("")
  const [fileUrl, setFileUrl] = useState("")

  const [historyModalOpen, setHistoryModalOpen] = useState(false)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editCategoryId, setEditCategoryId] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editAmount, setEditAmount] = useState("")
  const [editExpenseDate, setEditExpenseDate] = useState("")

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

  async function handleAddAttachment() {
    if (!request) return

    try {
      setActionLoading(true)
      setError("")

      await api.post(`/reimbursements/${request.id}/attachments`, {
        fileName,
        fileType,
        fileUrl,
      })

      setFileName("")
      setFileType("")
      setFileUrl("")
      setAttachModalOpen(false)

      await loadRequest()
    } catch {
      setError("Erro ao adicionar anexo")
    } finally {
      setActionLoading(false)
    }
  }

  function handleCloseAttachModal() {
    setAttachModalOpen(false)
    setFileName("")
    setFileType("")
    setFileUrl("")
  }

  function handleOpenEditModal() {
    if (!request) return

    setEditCategoryId(request.category?.id ?? "")
    setEditDescription(request.description)
    setEditAmount(String(request.amount))
    setEditExpenseDate(convertBrazilianDateToInputDate(request.expenseDate))
    setEditModalOpen(true)
  }

  function handleCloseEditModal() {
    setEditModalOpen(false)
    setEditCategoryId("")
    setEditDescription("")
    setEditAmount("")
    setEditExpenseDate("")
  }

  async function handleUpdateRequest() {
    if (!request) return

    try {
      setActionLoading(true)
      setError("")

      await api.put(`/reimbursements/${request.id}`, {
        categoryId: editCategoryId,
        description: editDescription,
        amount: Number(editAmount),
        expenseDate: editExpenseDate,
      })

      handleCloseEditModal()

      await loadRequest()
    } catch {
      setError("Erro ao editar solicitação")
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

  useEffect(() => {
    loadRequest()
    loadCategories()
  }, [id])

  if (loading) return <p>Carregando solicitação...</p>

  if (error) {
    return (
      <main>
        <p>{error}</p>

        <button type="button" onClick={() => navigate("/")}>
          Voltar
        </button>
      </main>
    )
  }

  if (!request) {
    return (
      <main>
        <p>Solicitação não encontrada.</p>

        <button type="button" onClick={() => navigate("/")}>
          Voltar
        </button>
      </main>
    )
  }

  return (
    <main>
      <button type="button" onClick={() => navigate("/")}>
        Voltar
      </button>

      <h1>Detalhe da solicitação</h1>

      <ReimbursementInfo request={request} />

      <AttachmentsSection
        attachments={request.attachments}
        userRole={user?.role}
        status={request.status}
        onOpenModal={() => setAttachModalOpen(true)}
      />

      <HistorySection onOpenModal={() => setHistoryModalOpen(true)} />

      <ReimbursementActions
        userRole={user?.role}
        status={request.status}
        actionLoading={actionLoading}
        onOpenEditModal={handleOpenEditModal}
        onCancelRequest={handleCancelRequest}
        onApproveRequest={handleApproveRequest}
      />

      <AttachModal
        open={attachModalOpen}
        actionLoading={actionLoading}
        fileName={fileName}
        fileType={fileType}
        fileUrl={fileUrl}
        onClose={handleCloseAttachModal}
        onSubmit={handleAddAttachment}
        onChangeFileName={setFileName}
        onChangeFileType={setFileType}
        onChangeFileUrl={setFileUrl}
      />

      <HistoryModal
        open={historyModalOpen}
        histories={request.histories}
        onClose={() => setHistoryModalOpen(false)}
      />

      <EditReimbursementModal
        open={editModalOpen}
        categories={categories}
        actionLoading={actionLoading}
        categoryId={editCategoryId}
        description={editDescription}
        amount={editAmount}
        expenseDate={editExpenseDate}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateRequest}
        onChangeCategoryId={setEditCategoryId}
        onChangeDescription={setEditDescription}
        onChangeAmount={setEditAmount}
        onChangeExpenseDate={setEditExpenseDate}
      />
    </main>
  )
}