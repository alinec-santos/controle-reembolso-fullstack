import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { ReimbursementRequest } from "../types"

export function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [requests, setRequests] = useState<ReimbursementRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadRequests() {
    try {
      setIsLoading(true)
      setError("")

      const response = await api.get("/reimbursements")

      setRequests(response.data)
    } catch {
      setError("Erro ao carregar solicitações")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  return (
    <main>
      <header>
        <h1>Dashboard</h1>

        <p>Bem-vindo(a), {user?.name}</p>
        <p>Perfil: {user?.role}</p>

        {user?.role === "COLABORADOR" && (
        <button onClick={() => navigate("/reimbursements/new")}>
          Nova solicitação
        </button>
        )}

        {user?.role === "ADMIN" && (
        <button type="button" onClick={() => navigate("/users")}>
          Gerenciar usuários
        </button>
        )}

        {user?.role === "ADMIN" && (
          <button onClick={() => navigate("/categories")}>
            Gerenciar categorias
          </button>
        )}

        <button onClick={logout}>Sair</button>
      </header>

      <section>
        <h2>Solicitações de reembolso</h2>

        {isLoading && <p>Carregando solicitações...</p>}

        {error && <p>{error}</p>}

        {!isLoading && !error && requests.length === 0 && (
          <p>Nenhuma solicitação encontrada.</p>
        )}

        {!isLoading && !error && requests.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data da despesa</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.description}</td>
                  <td>{request.category?.name ?? "Sem categoria"}</td>
                  <td>R$ {Number(request.amount).toFixed(2)}</td>
                  <td>{request.status}</td>
                  <td>
                    {new Date(request.expenseDate).toLocaleDateString("pt-BR")}
                  </td>
                  <td>
                    <button onClick={() => navigate(`/reimbursements/${request.id}`)}>
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}