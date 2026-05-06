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

export function ReimbursementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [request, setRequest] = useState<Reimbursement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

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

      <section>
        <h2>Informações da solicitação</h2>

        <p>
          <strong>Descrição:</strong> {request.description}
        </p>

        <p>
          <strong>Categoria:</strong>{" "}
          {request.category?.name ?? "Sem categoria"}
        </p>

        <p>
          <strong>Valor:</strong> R$ {Number(request.amount).toFixed(2)}
        </p>

        <p>
          <strong>Status:</strong> {request.status}
        </p>

        <p>
          <strong>Data da despesa:</strong> {request.expenseDate}
        </p>

        <p>
          <strong>Criada em:</strong> {request.createdAt}
        </p>

        <p>
          <strong>Atualizada em:</strong> {request.updatedAt}
        </p>

        {request.user && (
          <>
            <p>
              <strong>Solicitante:</strong> {request.user.name}
            </p>

            <p>
              <strong>Email:</strong> {request.user.email}
            </p>

            <p>
              <strong>Perfil:</strong> {request.user.role}
            </p>
          </>
        )}

        {request.rejectionReason && (
          <p>
            <strong>Motivo da rejeição:</strong> {request.rejectionReason}
          </p>
        )}
      </section>

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
          <button type="button">Adicionar anexo</button>
        )}
      </section>

      <section>
        <h2>Ações disponíveis</h2>

        {user?.role === "COLABORADOR" && request.status === "RASCUNHO" && (
          <>
            <button type="button">Editar solicitação</button>
            <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={actionLoading}
            >
                {actionLoading ? "Enviando..." : "Enviar solicitação"}
            </button>
            <button type="button">Cancelar solicitação</button>
          </>
        )}

        {user?.role === "COLABORADOR" && request.status === "ENVIADO" && (
          <button type="button">Cancelar solicitação</button>
        )}

        {user?.role === "GESTOR" && request.status === "ENVIADO" && (
          <>
            <button type="button">Aprovar</button>
            <button type="button">Rejeitar</button>
          </>
        )}

        {user?.role === "FINANCEIRO" && request.status === "APROVADO" && (
          <button type="button">Marcar como paga</button>
        )}
      </section>

      <section>
        <h2>Histórico da solicitação</h2>

        {!request.histories || request.histories.length === 0 ? (
          <p>Nenhum histórico encontrado.</p>
        ) : (
          <ul>
            {request.histories.map((history) => (
              <li key={history.id}>
                <p>
                  <strong>Ação:</strong> {history.action}
                </p>

                <p>
                  <strong>Usuário:</strong>{" "}
                  {history.user?.name ?? "Usuário não informado"}
                </p>

                <p>
                  <strong>Data/hora:</strong> {history.createdAt}
                </p>

                {history.observation && (
                  <p>
                    <strong>Observação:</strong> {history.observation}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}