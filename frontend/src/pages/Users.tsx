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
  const { user } = useAuth()

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
    <main>
      <button type="button" onClick={() => navigate("/")}>
        Voltar
      </button>

      <h1>Gerenciar usuários</h1>

      {successMessage && <p>{successMessage}</p>}
      {error && <p>{error}</p>}

      <UserForm
        isEditing={isEditing}
        actionLoading={actionLoading}
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        onCancelEdit={resetForm}
      />

      <UsersTable users={users} loading={loading} onEdit={handleEdit} />
    </main>
  )
}