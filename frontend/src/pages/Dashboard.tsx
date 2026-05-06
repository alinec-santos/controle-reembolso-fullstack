import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { ReimbursementRequest } from "../types"

export function Dashboard() {
  const { user, logout } = useAuth()

  const [requests, setRequests] = useState<ReimbursementRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadRequests() {
    try {
      setIsLoading(true)
      setError("")

      const response = await api.get("/reimbursements") //usa o axios configurado. Como o token ja foi salvo no authcontext, o back consegue identificar o usuario e aplicar as regras

      setRequests(response.data)
    } catch {
      setError("Erro ao carregar solicitações")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { //quando a tela abrir carrega as solicitacoes
    loadRequests()
  }, [])

  return (
    <main>
      <header>
        <h1>Dashboard</h1>

        <p>Bem-vindo(a), {user?.name}</p>
        <p>Perfil: {user?.role}</p>

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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}