import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form"

type UserFormData = {
  name: string
  email: string
  password: string
  role: "COLABORADOR" | "GESTOR" | "FINANCEIRO" | "ADMIN"
}

type Props = {
  isEditing: boolean
  actionLoading: boolean
  register: UseFormRegister<UserFormData>
  errors: FieldErrors<UserFormData>
  onSubmit: () => void
  onCancelEdit: () => void
}

const roles = ["COLABORADOR", "GESTOR", "FINANCEIRO", "ADMIN"] as const

export function UserForm({
  isEditing,
  actionLoading,
  register,
  errors,
  onSubmit,
  onCancelEdit,
}: Props) {
  return (
    <section>
      <h2>{isEditing ? "Editar usuário" : "Criar usuário"}</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Nome</label>
          <input id="name" type="text" {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">
            Senha {isEditing && "(preencha apenas se quiser alterar)"}
          </label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="role">Perfil</label>
          <select id="role" {...register("role")}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && <p>{errors.role.message}</p>}
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