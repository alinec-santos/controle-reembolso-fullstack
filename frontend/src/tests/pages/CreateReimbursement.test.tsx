import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { CreateReimbursement } from "../../pages/CreateReimbursement"
import { api } from "../../api/api"

const navigateMock = vi.fn()

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}))

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "user-1",
      name: "Aline",
      email: "aline@email.com",
      role: "COLABORADOR",
    },
  }),
}))

vi.mock("../../api/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe("CreateReimbursement", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(api.get).mockResolvedValue({
      data: [
        {
          id: "category-1",
          name: "Transporte",
          active: true,
        },
      ],
    })

    vi.mocked(api.post).mockResolvedValue({})
  })

  it("deve exibir erro quando categoria não for selecionada", async () => {
    const user = userEvent.setup()

    render(<CreateReimbursement />)

    await user.type(screen.getByLabelText("Descrição"), "Uber reunião")
    await user.type(screen.getByLabelText("Valor"), "50")
    await user.type(screen.getByLabelText("Data da despesa"), "2026-05-07")

    await user.click(screen.getByRole("button", { name: "Salvar" }))

    expect(
    await screen.findByText("Selecione uma categoria", { selector: 'p' })
    ).toBeInTheDocument();

    expect(api.post).not.toHaveBeenCalled()
  })

  it("deve exibir erro quando descrição tiver menos de 3 caracteres", async () => {
    const user = userEvent.setup()

    render(<CreateReimbursement />)

    await waitFor(() => {
      expect(screen.getByText("Transporte")).toBeInTheDocument()
    })

    await user.selectOptions(screen.getByLabelText("Categoria"), "category-1")
    await user.type(screen.getByLabelText("Descrição"), "Ab")
    await user.type(screen.getByLabelText("Valor"), "50")
    await user.type(screen.getByLabelText("Data da despesa"), "2026-05-07")

    await user.click(screen.getByRole("button", { name: "Salvar" }))

    expect(
      await screen.findByText("Descrição deve ter pelo menos 3 caracteres")
    ).toBeInTheDocument()

    expect(api.post).not.toHaveBeenCalled()
  })

  it("deve exibir erro quando valor for zero", async () => {
    const user = userEvent.setup()

    render(<CreateReimbursement />)

    await waitFor(() => {
      expect(screen.getByText("Transporte")).toBeInTheDocument()
    })

    await user.selectOptions(screen.getByLabelText("Categoria"), "category-1")
    await user.type(screen.getByLabelText("Descrição"), "Uber reunião")
    await user.clear(screen.getByLabelText("Valor"))
    await user.type(screen.getByLabelText("Valor"), "0")
    await user.type(screen.getByLabelText("Data da despesa"), "2026-05-07")

    await user.click(screen.getByRole("button", { name: "Salvar" }))

    expect(
      await screen.findByText("Valor deve ser maior que zero")
    ).toBeInTheDocument()

    expect(api.post).not.toHaveBeenCalled()
  })

  it("deve criar solicitação quando formulário for válido", async () => {
    const user = userEvent.setup()

    render(<CreateReimbursement />)

    await waitFor(() => {
      expect(screen.getByText("Transporte")).toBeInTheDocument()
    })

    await user.selectOptions(screen.getByLabelText("Categoria"), "category-1")
    await user.type(screen.getByLabelText("Descrição"), "Uber reunião")
    await user.clear(screen.getByLabelText("Valor"))
    await user.type(screen.getByLabelText("Valor"), "50")
    await user.type(screen.getByLabelText("Data da despesa"), "2026-05-07")

    await user.click(screen.getByRole("button", { name: "Salvar" }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/reimbursements", {
        categoryId: "category-1",
        description: "Uber reunião",
        amount: 50,
        expenseDate: "2026-05-07",
      })
    })

    expect(navigateMock).toHaveBeenCalledWith("/")
  })
})