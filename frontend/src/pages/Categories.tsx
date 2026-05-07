import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { Category } from "../types/category"
import { CategoryForm } from "../components/categories/CategoryForm"
import { CategoriesTable } from "../components/categories/CategoriesTable"
import { getApiErrorMessage } from "../utils/getApiErrorMessage"

const categorySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  active: z.boolean(),
})

type CategoryFormData = z.infer<typeof categorySchema>

export function Categories() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [editingCategoryId, setEditingCategoryId] =
    useState<string | null>(null)

  const isEditing = Boolean(editingCategoryId)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      active: true,
    },
  })

  async function loadCategories() {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/categories")

      setCategories(response.data)
    } catch (error) {
      setError(getApiErrorMessage(error, "Erro ao carregar categorias"))
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setEditingCategoryId(null)

    reset({
      name: "",
      active: true,
    })
  }

  function handleEdit(category: Category) {
    setEditingCategoryId(category.id)

    setValue("name", category.name)
    setValue("active", category.active)
  }

  async function onSubmit(data: CategoryFormData) {
    try {
      setActionLoading(true)
      setError("")
      setSuccessMessage("")

      if (isEditing) {
        await api.put(`/categories/${editingCategoryId}`, data)

        setSuccessMessage("Categoria atualizada com sucesso.")
      } else {
        await api.post("/categories", data)

        setSuccessMessage("Categoria criada com sucesso.")
      }

      resetForm()

      await loadCategories()
    } catch (error) {
      setError(getApiErrorMessage(error, "Erro ao salvar categoria"))
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/")
      return
    }

    loadCategories()
  }, [user, navigate])

  return (
    <main>
      <button type="button" onClick={() => navigate("/")}>
        Voltar
      </button>

      <h1>Gerenciar categorias</h1>

      {successMessage && <p>{successMessage}</p>}
      {error && <p>{error}</p>}

      <CategoryForm
        isEditing={isEditing}
        actionLoading={actionLoading}
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        onCancelEdit={resetForm}
      />

      <CategoriesTable
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
      />
    </main>
  )
}