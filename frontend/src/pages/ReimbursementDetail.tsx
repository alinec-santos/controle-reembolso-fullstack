import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import { ReimbursementInfo } from "../components/reimbursement/ReimbursementInfo"
import { ReimbursementAttachments } from "../components/reimbursement/ReimbursementAttachments"
import { ReimbursementActions } from "../components/reimbursement/ReimbursementActions"
import { ReimbursementHistory } from "../components/reimbursement/ReimbursementHistory"

export type Attachment = {
  id: string
  requestId: string
  fileName: string
  fileType: string
  fileUrl: string
  createdAt: string
}

export type History = {
  id: string
  requestId: string
  userId: string
  action: string
  observation?: string | null
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export type Reimbursement = {
  id: string
  description: string
  amount: number
  expenseDate: string
  status: string
  rejectionReason?: string | null
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
  }
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
  attachments?: Attachment[]
  histories?: History[]
}

export type AttachmentFormData = {
  fileName: string
  fileType: string
  fileUrl: string
}

export function ReimbursementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [request, setRequest] = useState<Reimbursement | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")

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

  async function handleSubmitRequest() {
    if (!request) return

    try {
      setActionLoading(true)
      setError("")

      await api.post(`/reimbursements/${request.id}/submit`)

      await loadRequest()
    } catch {
      setError("Erro ao enviar solicitação")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleAddAttachment(data: AttachmentFormData) {
    if (!request) return

    try {
      setActionLoading(true)
      setError("")

      await api.post(`/reimbursements/${request.id}/attachments`, data)

      await loadRequest()
    } catch {
      setError("Erro ao adicionar anexo")
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    loadRequest()
  }, [id])

  if (loading) {
    return <p>Carregando solicitação...</p>
  }

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

      <ReimbursementAttachments
        attachments={request.attachments ?? []}
        userRole={user?.role}
        requestStatus={request.status}
        actionLoading={actionLoading}
        onAddAttachment={handleAddAttachment}
      />

      <ReimbursementActions
        userRole={user?.role}
        requestStatus={request.status}
        actionLoading={actionLoading}
        onSubmitRequest={handleSubmitRequest}
      />

      <ReimbursementHistory histories={request.histories ?? []} />
    </main>
  )
}