import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { User } from "../types/Users"
import { UserForm } from "../components/users/UserForm"
import { UsersTable } from "../components/users/UsersTable"

export function Users() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [users, setUsers] = useState<User[]>([])

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("COLABORADOR")

  const isEditing = Boolean(editingUserId)

  async function loadUsers() {
    try {
      setLoading(true)
      setError("")

      const response = await api.get("/users")

      setUsers(response.data)
    } catch {
      setError("Erro ao carregar usuários")
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setEditingUserId(null)
    setName("")
    setEmail("")
    setPassword("")
    setRole("COLABORADOR")
  }

  function handleEdit(userToEdit: User) {
    setEditingUserId(userToEdit.id)
    setName(userToEdit.name)
    setEmail(userToEdit.email)
    setPassword("")
    setRole(userToEdit.role)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      setActionLoading(true)
      setError("")
      setSuccessMessage("")

      if (isEditing) {
        await api.put(`/users/${editingUserId}`, {
          name,
          email,
          role,
          ...(password ? { password } : {}),
        })

        setSuccessMessage("Usuário atualizado com sucesso.")
      } else {
        await api.post("/users", {
          name,
          email,
          password,
          role,
        })

        setSuccessMessage("Usuário criado com sucesso.")
      }

      resetForm()
      await loadUsers()
    } catch {
      setError("Erro ao salvar usuário")
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
        name={name}
        email={email}
        password={password}
        role={role}
        onChangeName={setName}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onChangeRole={setRole}
        onSubmit={handleSubmit}
        onCancelEdit={resetForm}
      />

      <UsersTable users={users} loading={loading} onEdit={handleEdit} />
    </main>
  )
}