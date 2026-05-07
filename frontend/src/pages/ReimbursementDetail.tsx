import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { api } from "../api/api"
import type { Reimbursement } from "../types/reimbursement"
import { ReimbursementInfo } from "../components/reimbursement/ReimbursementInfo"
import { AttachmentsSection } from "../components/reimbursement/ReimbursementAttachments"
import { HistorySection } from "../components/reimbursement/ReimbursementHistory"
import { AttachModal } from "../components/reimbursement/Attachmodal"
import { HistoryModal } from "../components/reimbursement/Historymodal"

export function ReimbursementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [request, setRequest] = useState<Reimbursement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const [attachModalOpen, setAttachModalOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("")
  const [fileUrl, setFileUrl] = useState("")

  const [historyModalOpen, setHistoryModalOpen] = useState(false)

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

  async function handleAddAttachment() {
    try {
      setActionLoading(true)
      setError("")
      await api.post(`/reimbursements/${request?.id}/attachments`, {
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

  useEffect(() => {
    loadRequest()
  }, [id])

  if (loading) return <p>Carregando solicitação...</p>

  if (error) {
    return (
      <main>
        <p>{error}</p>
        <button type="button" onClick={() => navigate("/")}>Voltar</button>
      </main>
    )
  }

  if (!request) {
    return (
      <main>
        <p>Solicitação não encontrada.</p>
        <button type="button" onClick={() => navigate("/")}>Voltar</button>
      </main>
    )
  }

  return (
    <main>
      <button type="button" onClick={() => navigate("/")}>Voltar</button>
      <h1>Detalhe da solicitação</h1>

      <ReimbursementInfo request={request} />

      <AttachmentsSection
        attachments={request.attachments}
        userRole={user?.role}
        status={request.status}
        onOpenModal={() => setAttachModalOpen(true)}
      />

      <HistorySection onOpenModal={() => setHistoryModalOpen(true)} />

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
    </main>
  )
}