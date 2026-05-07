import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { userRoles } from "../../types/Users"

// 1. Schema de validação com Zod
const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(userRoles as [string, ...string[]], {
    errorMap: () => ({ message: "Perfil inválido" }),
  }),
})

const editUserSchema = createUserSchema.extend({
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .or(z.literal("")), // permite vazio ao editar
})

type CreateUserData = z.infer<typeof createUserSchema>
type EditUserData = z.infer<typeof editUserSchema>
type FormData = CreateUserData | EditUserData

// 2. O pai passa os dados válidos prontos — sem precisar tratar FormEvent
type Props = {
  isEditing: boolean
  actionLoading: boolean
  // Valores iniciais para preencher o form ao editar
  defaultValues?: {
    name: string
    email: string
    role: string
  }
  // apiError: erro retornado pela API (ex: "Email já cadastrado")
  apiError?: string
  onSubmit: (data: FormData) => Promise<void>
  onCancelEdit: () => void
}

export function UserForm({
  isEditing,
  actionLoading,
  defaultValues,
  apiError,
  onSubmit,
  onCancelEdit,
}: Props) {
  const schema = isEditing ? editUserSchema : createUserSchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      password: "",
      role: defaultValues?.role ?? userRoles[0],
    },
  })

  // Quando os dados iniciais mudarem (ao clicar em "editar" uma linha), reinicia o form
  useEffect(() => {
    reset({
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      password: "",
      role: defaultValues?.role ?? userRoles[0],
    })
  }, [defaultValues, reset])

  return (
    <section>
      <h2>{isEditing ? "Editar usuário" : "Criar usuário"}</h2>

      {/* Erro da API — específico, não genérico */}
      {apiError && <p style={{ color: "red" }}>{apiError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="name">Nome</label>
          <input id="name" type="text" {...register("name")} />
          {/* Mensagem de erro do campo */}
          {errors.name && <span style={{ color: "red" }}>{errors.name.message}</span>}
        </div>

        <div>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <span style={{ color: "red" }}>{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password">
            Senha {isEditing && "(preencha apenas se quiser alterar)"}
          </label>
          <input id="password" type="password" {...register("password")} />
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="role">Perfil</label>
          <select id="role" {...register("role")}>
            {userRoles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
          {errors.role && <span style={{ color: "red" }}>{errors.role.message}</span>}
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