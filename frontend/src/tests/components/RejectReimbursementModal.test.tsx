import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { RejectReimbursementModal } from "../../components/reimbursement/RejectReimbursementModal"

describe("RejectReimbursementModal", () => {
  it("deve exibir erro quando a justificativa tiver menos de 5 caracteres", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <RejectReimbursementModal
        open={true}
        actionLoading={false}
        onClose={() => {}}
        onSubmit={onSubmit}
      />
    )

    await user.type(screen.getByLabelText("Justificativa"), "abc")
    await user.click(
      screen.getByRole("button", { name: "Rejeitar solicitação" })
    )

    expect(
      await screen.findByText("Justificativa deve ter pelo menos 5 caracteres")
    ).toBeInTheDocument()

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("deve chamar onSubmit quando a justificativa for válida", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <RejectReimbursementModal
        open={true}
        actionLoading={false}
        onClose={() => {}}
        onSubmit={onSubmit}
      />
    )

    await user.type(
      screen.getByLabelText("Justificativa"),
      "Nota fiscal inválida"
    )

    await user.click(
      screen.getByRole("button", { name: "Rejeitar solicitação" })
    )

    expect(onSubmit).toHaveBeenCalledWith("Nota fiscal inválida")
  })

  it("não deve renderizar quando estiver fechado", () => {
    render(
      <RejectReimbursementModal
        open={false}
        actionLoading={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    )

    expect(screen.queryByText("Rejeitar solicitação")).not.toBeInTheDocument()
  })
})