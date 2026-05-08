import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { User } from "../types/Users"
import { UserForm } from "../components/users/UserForm"
import { UsersTable } from "../components/users/UsersTable"
import { getApiErrorMessage } from "../utils/getApiErrorMessage"

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

const userSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Informe um e-mail válido"),
    password: z.string(),
    role: z.enum(["COLABORADOR", "GESTOR", "FINANCEIRO", "ADMIN"]),
  })
  .superRefine((data, context) => {
    if (!data.password) return

    if (data.password.length < 6) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Senha deve ter pelo menos 6 caracteres",
      })
    }
  })

type UserFormData = z.infer<typeof userSchema>

export function Users() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  const isEditing = Boolean(editingUserId)

  const {
    register,
    handleSubmit,
    reset,
    setError: setFormError,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "COLABORADOR",
    },
  })

  async function loadUsers() {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/users")
      setUsers(response.data)
    } catch (error) {
      setError(getApiErrorMessage(error, "Erro ao carregar usuários"))
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setEditingUserId(null)

    reset({
      name: "",
      email: "",
      password: "",
      role: "COLABORADOR",
    })
  }

  function handleEdit(userToEdit: User) {
    setEditingUserId(userToEdit.id)

    reset({
      name: userToEdit.name,
      email: userToEdit.email,
      password: "",
      role: userToEdit.role as UserFormData["role"],
    })
  }

  async function onSubmit(data: UserFormData) {
    if (!isEditing && !data.password) {
      setFormError("password", {
        message: "Senha é obrigatória para criar usuário",
      })

      return
    }

    try {
      setActionLoading(true)
      setError("")
      setSuccessMessage("")

      if (isEditing) {
        await api.put(`/users/${editingUserId}`, {
          name: data.name,
          email: data.email,
          role: data.role,
          ...(data.password ? { password: data.password } : {}),
        })

        setSuccessMessage("Usuário atualizado com sucesso.")
      } else {
        await api.post("/users", data)

        setSuccessMessage("Usuário criado com sucesso.")
      }

      resetForm()
      await loadUsers()
    } catch (error) {
      setError(getApiErrorMessage(error, "Erro ao salvar usuário"))
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/")
      return
    }

    loadUsers()
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Gerenciar usuários</h1>
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

        <UserForm
          isEditing={isEditing}
          actionLoading={actionLoading}
          register={register}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          onCancelEdit={resetForm}
        />

        <UsersTable 
          users={users} 
          loading={loading} 
          onEdit={handleEdit} 
        />
      </main>
    </div>
  )
}