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

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

const categorySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  active: z.boolean(),
})

type CategoryFormData = z.infer<typeof categorySchema>

export function Categories() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

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

      const nameNormalized = data.name.trim().toLowerCase()
      const categoryExists = categories.some(
        (cat) => 
          cat.name.trim().toLowerCase() === nameNormalized && 
          cat.id !== editingCategoryId
      )

      if (categoryExists) {
        setError("Já existe uma categoria com este nome.")
        setActionLoading(false)
        return
      }

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
    <div className="min-h-screen bg-[#f4f6f8] font-sans">
      <header className="flex items-center justify-between px-6 md:px-8 py-5 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img 
            src="/pitang-logo.png" 
            alt="Pitang" 
            className="h-9 object-contain cursor-pointer" 
            onClick={() => navigate("/")}
          />
          <span className="text-[#C13227] font-semibold text-base md:text-lg border-l border-gray-300 pl-4">Dashboard</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-gray-700 hidden sm:block">Olá, {user?.name}!</span>
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-lg font-bold border border-gray-200 shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          
          <button 
            onClick={logout} 
            className="text-gray-500 hover:text-[#C13227] transition-colors flex items-center gap-2 text-base font-medium" 
            title="Sair"
          >
             <LogoutIcon /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Gerenciar categorias</h1>
          
          <button 
            type="button" 
            onClick={() => navigate("/")}
            className="text-slate-500 bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-md font-semibold text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Voltar para Dashboard
          </button>
        </div>

        {successMessage && (
          <div className="mb-8 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md shadow-sm text-base font-medium">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm text-base font-medium">
            {error}
          </div>
        )}

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
    </div>
  )
}