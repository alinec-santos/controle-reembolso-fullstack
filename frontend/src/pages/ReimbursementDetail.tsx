import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"

type Attachment = {
  id: string
  requestId: string
  fileName: string
  fileType: string
  fileUrl: string
  createdAt: string
}

type History = {
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

type Reimbursement = {
  id: string
  description: string
  amount: number
  expenseDate: string
  status: string
  rejectionReason?: string | null
  createdAt: string
  updatedAt: string
  category?: { id: string; name: string }
  user?: { id: string; name: string; email: string; role: string }
  attachments?: Attachment[]
  histories?: History[]
}

export function ReimbursementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [request, setRequest] = useState<Reimbursement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  // Modal de anexo
  const [attachModalOpen, setAttachModalOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("")
  const [fileUrl, setFileUrl] = useState("")

  // Modal de histórico
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

  async function handleSubmitRequest() {
    try {
      setActionLoading(true)
      setError("")
      await api.post(`/reimbursements/${request?.id}/submit`)
      await loadRequest()
    } catch {
      setError("Erro ao enviar solicitação")
    } finally {
      setActionLoading(false)
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

      <section>
        <h2>Informações da solicitação</h2>
        <p><strong>Descrição:</strong> {request.description}</p>
        <p><strong>Categoria:</strong> {request.category?.name ?? "Sem categoria"}</p>
        <p><strong>Valor:</strong> R$ {Number(request.amount).toFixed(2)}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>Data da despesa:</strong> {request.expenseDate}</p>
        <p><strong>Criada em:</strong> {request.createdAt}</p>
        <p><strong>Atualizada em:</strong> {request.updatedAt}</p>
        {request.user && (
          <>
            <p><strong>Solicitante:</strong> {request.user.name}</p>
            <p><strong>Email:</strong> {request.user.email}</p>
            <p><strong>Perfil:</strong> {request.user.role}</p>
          </>
        )}
        {request.rejectionReason && (
          <p><strong>Motivo da rejeição:</strong> {request.rejectionReason}</p>
        )}
      </section>

      {/* ── SEÇÃO DE ANEXOS ── */}
      <section>
        <h2>Anexos</h2>

        {!request.attachments || request.attachments.length === 0 ? (
          <p>Nenhum anexo cadastrado.</p>
        ) : (
          <ul>
            {request.attachments.map((attachment) => (
              <li key={attachment.id}>
                <a href={attachment.fileUrl} target="_blank" rel="noreferrer">
                  {attachment.fileName}
                </a>
                <span> - {attachment.fileType}</span>
              </li>
            ))}
          </ul>
        )}

        {user?.role === "COLABORADOR" && request.status === "RASCUNHO" && (
          <button type="button" onClick={() => setAttachModalOpen(true)}>
            Adicionar anexo
          </button>
        )}
      </section>

      {/* ── SEÇÃO DE HISTÓRICO ── */}
      <section>
        <h2>Histórico da solicitação</h2>
        <button type="button" onClick={() => setHistoryModalOpen(true)}>
          Visualizar histórico
        </button>
      </section>

      {/* ── MODAL: ADICIONAR ANEXO ── */}
      {attachModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "1.5rem",
              width: 380,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0 }}>Adicionar anexo</h3>
              <button type="button" onClick={handleCloseAttachModal}>✕</button>
            </div>

            <div>
              <label htmlFor="fileName">Nome do arquivo</label>
              <input
                id="fileName"
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="ex: nota-fiscal.pdf"
              />
            </div>

            <div>
              <label htmlFor="fileType">Tipo do arquivo</label>
              <input
                id="fileType"
                type="text"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                placeholder="ex: application/pdf"
              />
            </div>

            <div>
              <label htmlFor="fileUrl">URL do arquivo</label>
              <input
                id="fileUrl"
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="ex: https://exemplo.com/nota.pdf"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" onClick={handleCloseAttachModal}>
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddAttachment}
                disabled={actionLoading || !fileName || !fileType || !fileUrl}
              >
                {actionLoading ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: HISTÓRICO ── */}
      {historyModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "1.5rem",
              width: 420,
              maxHeight: "80vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0 }}>Histórico da solicitação</h3>
              <button type="button" onClick={() => setHistoryModalOpen(false)}>✕</button>
            </div>

            {!request.histories || request.histories.length === 0 ? (
              <p>Nenhum histórico encontrado.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {request.histories.map((history) => (
                  <li key={history.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                    <p style={{ margin: "0 0 4px" }}><strong>Ação:</strong> {history.action}</p>
                    <p style={{ margin: "0 0 4px" }}><strong>Usuário:</strong> {history.user?.name ?? "Usuário não informado"}</p>
                    <p style={{ margin: "0 0 4px" }}><strong>Data/hora:</strong> {history.createdAt}</p>
                    {history.observation && (
                      <p style={{ margin: 0 }}><strong>Observação:</strong> {history.observation}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setHistoryModalOpen(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}