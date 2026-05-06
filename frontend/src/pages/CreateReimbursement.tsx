import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { Category } from "../types"

export function CreateReimbursement() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])

  const [categoryId, setCategoryId] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [expenseDate, setExpenseDate] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const canCreateRequest = user?.role === "COLABORADOR"

  async function loadCategories() {
    try {
      const response = await api.get("/categories")
      setCategories(response.data)
    } catch {
      setError("Erro ao carregar categorias")
    }
  }

  useEffect(() => {
    if (!canCreateRequest) {
      navigate("/")
      return
    }

    loadCategories()
  }, [canCreateRequest, navigate])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!canCreateRequest) {
      setError("Você não tem permissão para criar solicitações.")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      await api.post("/reimbursements", {
        categoryId,
        description,
        amount: Number(amount),
        expenseDate,
      })

      navigate("/")
    } catch {
      setError("Erro ao criar solicitação")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <h1>Nova solicitação</h1>

      <button type="button" onClick={() => navigate("/")}>
        Voltar
      </button>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="categoryId">Categoria</label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description">Descrição</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="amount">Valor</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="expenseDate">Data da despesa</label>
          <input
            id="expenseDate"
            type="date"
            value={expenseDate}
            onChange={(event) => setExpenseDate(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </main>
  )
}