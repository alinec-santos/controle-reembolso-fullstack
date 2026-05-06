import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"

type Reimbursement = { //garante que o TypeScript saiba quais propriedades existem no objeto.
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
}

export function ReimbursementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [request, setRequest] = useState<Reimbursement | null>(null) //armazena os dados do reembolso apos virem da API
  const [loading, setLoading] = useState(true) //controla se uma mensagem de carregando deve aparecer
  const [error, setError] = useState("") //armazena mensagens de erro caso a requisicao falhe

  async function loadRequest() {
    try {
      setLoading(true)
      setError("")

      const response = await api.get(`/reimbursements/${id}`)
      setRequest(response.data)
    } catch (error) {
      setError("Não foi possível carregar os detalhes da solicitação.")
    } finally {
      setLoading(false)
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
        <button onClick={() => navigate("/dashboard")}>Voltar</button>
      </main>
    )
  }

  if (!request) {
    return (
      <main>
        <p>Solicitação não encontrada.</p>
        <button onClick={() => navigate("/dashboard")}>Voltar</button>
      </main>
    )
  }

  return (
    <main>
      <button onClick={() => navigate("/dashboard")}>Voltar</button>

      <h1>Detalhe da solicitação</h1>

      <section>
        <p>
          <strong>Descrição:</strong> {request.description}
        </p>

        <p>
          <strong>Categoria:</strong> {request.category?.name}
        </p>

        <p>
          <strong>Valor:</strong>{" "}
          {Number(request.amount).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

        <p>
          <strong>Data da despesa:</strong>{" "}
          {new Date(request.expenseDate).toLocaleDateString("pt-BR")}
        </p>

        <p>
          <strong>Status:</strong> {request.status}
        </p>

        {request.rejectionReason && (
          <p>
            <strong>Motivo da rejeição:</strong> {request.rejectionReason}
          </p>
        )}

        {request.user && (
          <>
            <p>
              <strong>Solicitante:</strong> {request.user.name}
            </p>

            <p>
              <strong>Email:</strong> {request.user.email}
            </p>
          </>
        )}
      </section>

      <section>
        <h2>Ações</h2>

        <p>Usuário logado: {user?.role}</p> {/**recupera o papel do usuario logado atraves de useAuth */}

        <button disabled>Enviar solicitação</button>
        <button disabled>Aprovar</button>
        <button disabled>Rejeitar</button>
        <button disabled>Pagar</button>
        <button disabled>Editar</button>
      </section>
    </main>
  )
}