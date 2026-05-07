import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { Category } from "../types"
import { getApiErrorMessage } from "../utils/getApiErrorMessage"

const createReimbursementSchema = z.object({
  categoryId: z.string().min(1, "Selecione uma categoria"),
  description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  expenseDate: z.string().min(1, "Informe a data da despesa"),
})

type CreateReimbursementFormData = z.infer<typeof createReimbursementSchema>

export function CreateReimbursement() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const canCreateRequest = user?.role === "COLABORADOR"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReimbursementFormData>({
    resolver: zodResolver(createReimbursementSchema),
    defaultValues: {
      categoryId: "",
      description: "",
      amount: 0,
      expenseDate: "",
    },
  })

  async function loadCategories() {
    try {
      const response = await api.get("/categories")
      setCategories(response.data)
    } catch (error) {
      setError(getApiErrorMessage(error, "Erro ao carregar categorias"))
    }
  }

  useEffect(() => {
    if (!canCreateRequest) {
      navigate("/")
      return
    }

    loadCategories()
  }, [canCreateRequest, navigate])

  async function onSubmit(data: CreateReimbursementFormData) {
    if (!canCreateRequest) {
      setError("Você não tem permissão para criar solicitações.")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      await api.post("/reimbursements", data)

      navigate("/")
    } catch (error) {
      setError(getApiErrorMessage(error, "Erro ao criar solicitação"))
    } finally {
      setIsLoading(false)
    }
  }
    const today = new Date().toISOString().split("T")[0]


  return (
    <main>
      <h1>Nova solicitação</h1>

      <button type="button" onClick={() => navigate("/")}>
        Voltar
      </button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="categoryId">Categoria</label>
          <select id="categoryId" {...register("categoryId")}>
            <option value="">Selecione uma categoria</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {errors.categoryId && <p>{errors.categoryId.message}</p>}
        </div>

        <div>
          <label htmlFor="description">Descrição</label>
          <input id="description" type="text" {...register("description")} />

          {errors.description && <p>{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="amount">Valor</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            {...register("amount")}
          />

          {errors.amount && <p>{errors.amount.message}</p>}
        </div>

        <div>
          <label htmlFor="expenseDate">Data da despesa</label>
          <input id="expenseDate" type="date" max={today}{...register("expenseDate")} />

          {errors.expenseDate && <p>{errors.expenseDate.message}</p>}
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </main>
  )
}