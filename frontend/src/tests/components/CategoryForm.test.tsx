import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CategoryForm } from "../../components/categories/CategoryForm"

const categorySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  active: z.boolean(),
})

type CategoryFormData = z.infer<typeof categorySchema>

type WrapperProps = {
  isEditing?: boolean
  onSubmit: (data: CategoryFormData) => void
}

function CategoryFormWrapper({
  isEditing = false,
  onSubmit,
}: WrapperProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      active: true,
    },
  })

  return (
    <CategoryForm
      isEditing={isEditing}
      actionLoading={false}
      register={register}
      errors={errors}
      onSubmit={handleSubmit(onSubmit)}
      onCancelEdit={() => {}}
    />
  )
}

describe("CategoryForm", () => {
  it("deve exibir erro quando o nome tiver menos de 3 caracteres", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<CategoryFormWrapper onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Nome"), "Ab")
    await user.click(screen.getByRole("button", { name: "Criar categoria" }))

    expect(
      await screen.findByText("Nome deve ter pelo menos 3 caracteres")
    ).toBeInTheDocument()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("deve chamar submit quando o formulário for válido", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<CategoryFormWrapper onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText("Nome"), "Transporte")
    await user.click(screen.getByRole("button", { name: "Criar categoria" }))

    expect(onSubmit).toHaveBeenCalled()
  })

  it("deve renderizar título e botão de edição quando estiver editando", () => {
    const onSubmit = vi.fn()

    render(<CategoryFormWrapper isEditing={true} onSubmit={onSubmit} />)

    expect(screen.getByText("Editar categoria")).toBeInTheDocument()
    expect(screen.getByText("Cancelar edição")).toBeInTheDocument()
  })
})