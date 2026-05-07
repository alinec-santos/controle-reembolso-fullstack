import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { Login } from "../../pages/Login"

const loginMock = vi.fn()

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}))

describe("Login", () => {
  beforeEach(() => {
    loginMock.mockClear()
  })

  it("deve exibir erro quando o email for inválido", async () => {
    const user = userEvent.setup()

    render(<Login />)

    await user.type(screen.getByLabelText("E-mail"), "email@invalido")
    await user.type(screen.getByLabelText("Senha"), "123456")
    await user.click(screen.getByRole("button", { name: "Entrar" }))

    expect(
      await screen.findByText("Informe um e-mail válido")
    ).toBeInTheDocument()

    expect(loginMock).not.toHaveBeenCalled()
  })

  it("deve exibir erro quando a senha estiver vazia", async () => {
    const user = userEvent.setup()

    render(<Login />)

    await user.type(screen.getByLabelText("E-mail"), "admin@email.com")
    await user.click(screen.getByRole("button", { name: "Entrar" }))

    expect(await screen.findByText("Informe a senha")).toBeInTheDocument()

    expect(loginMock).not.toHaveBeenCalled()
  })

  it("deve chamar login quando os dados forem válidos", async () => {
    const user = userEvent.setup()

    render(<Login />)

    await user.type(screen.getByLabelText("E-mail"), "admin@email.com")
    await user.type(screen.getByLabelText("Senha"), "123456")
    await user.click(screen.getByRole("button", { name: "Entrar" }))

    expect(loginMock).toHaveBeenCalledWith({
      email: "admin@email.com",
      password: "123456",
    })
  })
})