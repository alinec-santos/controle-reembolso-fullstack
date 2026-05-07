type Props = {
  userRole?: string
  status: string
  actionLoading: boolean
  onOpenEditModal: () => void
  onCancelRequest: () => void
  onApproveRequest: () => void
}
export function ReimbursementActions({
  userRole,
  status,
  actionLoading,
  onOpenEditModal,
  onCancelRequest,
  onApproveRequest,
}: Props) {
  return (
    <section>
      <h2>Ações disponíveis</h2>

      {userRole === "COLABORADOR" && status === "RASCUNHO" && (
        <>
          <button type="button" onClick={onOpenEditModal}>
            Editar solicitação
          </button>

          <button type="button" disabled={actionLoading}>
            Enviar solicitação
          </button>

          <button
            type="button"
            onClick={onCancelRequest}
            disabled={actionLoading}
          >
            {actionLoading ? "Cancelando..." : "Cancelar solicitação"}
          </button>
        </>
      )}

      {userRole === "COLABORADOR" && status === "ENVIADO" && (
        <button
          type="button"
          onClick={onCancelRequest}
          disabled={actionLoading}
        >
          {actionLoading ? "Cancelando..." : "Cancelar solicitação"}
        </button>
      )}

      {userRole === "GESTOR" && status === "ENVIADO" && (
        <>
          <button
            type="button"
            onClick={onApproveRequest}
            disabled={actionLoading}
          >
            {actionLoading ? "Aprovando..." : "Aprovar"}
          </button>
          <button type="button">Rejeitar</button>
        </>
      )}

      {userRole === "FINANCEIRO" && status === "APROVADO" && (
        <button type="button">Marcar como paga</button>
      )}
    </section>
  )
}