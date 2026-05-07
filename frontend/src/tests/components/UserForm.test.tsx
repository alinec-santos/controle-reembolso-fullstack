import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserForm } from "../../components/users/UserForm"

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

type WrapperProps = {
  isEditing?: boolean
  onSubmit: (data: UserFormData) => void
}

function UserFormWrapper({ isEditing = false, onSubmit }: WrapperProps) {
  const {
    register,
    handleSubmit,
    setError,
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

  function submit(data: UserFormData) {
    if (!isEditing && !data.password) {
      setError("password", {
        message: "Senha é obrigatória para criar usuário",
      })

      return
    }

    onSubmit(data)
  }

  return (
    <UserForm
      isEditing={isEditing}
      actionLoading={false}
      register={register}
      errors={errors}
      onSubmit={handleSubmit(submit)}
      onCancelEdit={() => {}}
    />
  )
}

describe("UserForm", () => {
  it("deve exibir erro quando o email for inválido", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<UserFormWrapper onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Nome"), "Aline")
    await user.type(screen.getByLabelText("Email"), "email@invalido")
    await user.type(screen.getByLabelText(/Senha/), "123456")

    await user.click(screen.getByRole("button", { name: "Criar usuário" }))

    expect(
      await screen.findByText("Informe um e-mail válido")
    ).toBeInTheDocument()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("deve exibir erro quando senha estiver vazia ao criar", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<UserFormWrapper onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Nome"), "Aline")
    await user.type(screen.getByLabelText("Email"), "aline@email.com")

    await user.click(screen.getByRole("button", { name: "Criar usuário" }))

    expect(
      await screen.findByText("Senha é obrigatória para criar usuário")
    ).toBeInTheDocument()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("deve chamar submit quando criação for válida", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<UserFormWrapper onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Nome"), "Aline")
    await user.type(screen.getByLabelText("Email"), "aline@email.com")
    await user.type(screen.getByLabelText(/Senha/), "123456")

    await user.click(screen.getByRole("button", { name: "Criar usuário" }))

    expect(onSubmit).toHaveBeenCalled()
  })

  it("deve permitir senha vazia na edição", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<UserFormWrapper isEditing={true} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Nome"), "Aline")
    await user.type(screen.getByLabelText("Email"), "aline@email.com")

    await user.click(screen.getByRole("button", { name: "Salvar edição" }))

    expect(onSubmit).toHaveBeenCalled()
  })

  it("deve renderizar modo de edição", () => {
    const onSubmit = vi.fn()

    render(<UserFormWrapper isEditing={true} onSubmit={onSubmit} />)

    expect(screen.getByText("Editar usuário")).toBeInTheDocument()
    expect(screen.getByText("Cancelar edição")).toBeInTheDocument()
  })
})