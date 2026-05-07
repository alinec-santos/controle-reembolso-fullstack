import { FormEvent } from "react"
import { userRoles } from "../../types/Users"

type Props = {
  isEditing: boolean
  actionLoading: boolean
  name: string
  email: string
  password: string
  role: string
  onChangeName: (value: string) => void
  onChangeEmail: (value: string) => void
  onChangePassword: (value: string) => void
  onChangeRole: (value: string) => void
  onSubmit: (event: FormEvent) => void
  onCancelEdit: () => void
}

export function UserForm({
  isEditing,
  actionLoading,
  name,
  email,
  password,
  role,
  onChangeName,
  onChangeEmail,
  onChangePassword,
  onChangeRole,
  onSubmit,
  onCancelEdit,
}: Props) {
  return (
    <section>
      <h2>{isEditing ? "Editar usuário" : "Criar usuário"}</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => onChangeName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => onChangeEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Senha {isEditing && "(preencha apenas se quiser alterar)"}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => onChangePassword(event.target.value)}
            required={!isEditing}
          />
        </div>

        <div>
          <label htmlFor="role">Perfil</label>
          <select
            id="role"
            value={role}
            onChange={(event) => onChangeRole(event.target.value)}
            required
          >
            {userRoles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={actionLoading}>
          {actionLoading
            ? "Salvando..."
            : isEditing
              ? "Salvar edição"
              : "Criar usuário"}
        </button>

        {isEditing && (
          <button type="button" onClick={onCancelEdit}>
            Cancelar edição
          </button>
        )}
      </form>
    </section>
  )
}