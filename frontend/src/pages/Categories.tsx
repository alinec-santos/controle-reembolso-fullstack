import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { Category } from "../types/category"
import { CategoryForm } from "../components/categories/CategoryForm"
import { CategoriesTable } from "../components/categories/CategoriesTable"
import { AxiosError } from "axios"

export function Categories() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [active, setActive] = useState(true)

  const isEditing = Boolean(editingCategoryId)

  async function loadCategories() {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/categories")

      setCategories(response.data)
    } catch {
      setError("Erro ao carregar categorias")
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setEditingCategoryId(null)
    setName("")
    setActive(true)
  }

  function handleEdit(category: Category) {
    setEditingCategoryId(category.id)
    setName(category.name)
    setActive(category.active)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      setActionLoading(true)
      setError("")
      setSuccessMessage("")

      if (isEditing) {
        await api.put(`/categories/${editingCategoryId}`, {
          name,
          active,
        })

        setSuccessMessage("Categoria atualizada com sucesso.")
      } else {
        await api.post("/categories", {
          name,
          active,
        })

        setSuccessMessage("Categoria criada com sucesso.")
      }

      resetForm()

      await loadCategories()
    } catch (error) {
    if (error instanceof AxiosError) {
        setError(error.response?.data?.message ?? "Erro ao salvar categoria")
        return
    }

    setError("Erro ao salvar categoria")
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
        name={name}
        active={active}
        onChangeName={setName}
        onChangeActive={setActive}
        onSubmit={handleSubmit}
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