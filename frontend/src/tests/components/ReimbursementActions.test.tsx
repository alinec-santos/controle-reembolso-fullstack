import { render, screen } from "@testing-library/react"
import { ReimbursementActions } from "../../components/reimbursement/ReimbursementActions"

describe("ReimbursementActions", () => {
  it("deve mostrar ações do colaborador em rascunho", () => {
    render(
      <ReimbursementActions
        userRole="COLABORADOR"
        status="RASCUNHO"
        actionLoading={false}
        onSubmitRequest={() => {}}
        onOpenEditModal={() => {}}
        onCancelRequest={() => {}}
        onApproveRequest={() => {}}
        onOpenRejectModal={() => {}}
        onPayRequest={() => {}}
      />
    )

    expect(
      screen.getByText("Editar solicitação")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Enviar solicitação")
    ).toBeInTheDocument()

    expect(
      screen.getByText("Cancelar solicitação")
    ).toBeInTheDocument()
  })

  it("deve mostrar ações do gestor para solicitação enviada", () => {
    render(
      <ReimbursementActions
        userRole="GESTOR"
        status="ENVIADO"
        actionLoading={false}
        onSubmitRequest={() => {}}
        onOpenEditModal={() => {}}
        onCancelRequest={() => {}}
        onApproveRequest={() => {}}
        onOpenRejectModal={() => {}}
        onPayRequest={() => {}}
      />
    )

    expect(screen.getByText("Aprovar")).toBeInTheDocument()

    expect(
      screen.getByText("Rejeitar")
    ).toBeInTheDocument()
  })

  it("deve mostrar ação do financeiro para solicitação aprovada", () => {
    render(
      <ReimbursementActions
        userRole="FINANCEIRO"
        status="APROVADO"
        actionLoading={false}
        onSubmitRequest={() => {}}
        onOpenEditModal={() => {}}
        onCancelRequest={() => {}}
        onApproveRequest={() => {}}
        onOpenRejectModal={() => {}}
        onPayRequest={() => {}}
      />
    )

    expect(
      screen.getByText("Marcar como paga")
    ).toBeInTheDocument()
  })

  it("não deve mostrar ações inválidas", () => {
    render(
      <ReimbursementActions
        userRole="ADMIN"
        status="APROVADO"
        actionLoading={false}
        onSubmitRequest={() => {}}
        onOpenEditModal={() => {}}
        onCancelRequest={() => {}}
        onApproveRequest={() => {}}
        onOpenRejectModal={() => {}}
        onPayRequest={() => {}}
      />
    )

    expect(
      screen.queryByText("Aprovar")
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText("Editar solicitação")
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText("Marcar como paga")
    ).not.toBeInTheDocument()
  })
})