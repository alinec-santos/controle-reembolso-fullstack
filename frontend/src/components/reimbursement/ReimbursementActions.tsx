type Props = {
  userRole?: string
  status: string
  actionLoading: boolean
  onOpenEditModal: () => void
  onSubmitRequest: () => void
  onCancelRequest: () => void
  onApproveRequest: () => void
  onOpenRejectModal: () => void
}

export function ReimbursementActions({
  userRole,
  status,
  actionLoading,
  onOpenEditModal,
  onSubmitRequest,
  onCancelRequest,
  onApproveRequest,
  onOpenRejectModal,
}: Props) {
  return (
    <section>
      <h2>Ações disponíveis</h2>

      {userRole === "COLABORADOR" && status === "RASCUNHO" && (
        <>
          <button type="button" onClick={onOpenEditModal}>
            Editar solicitação
          </button>

          <button
            type="button"
            onClick={onSubmitRequest}
            disabled={actionLoading}
          >
            {actionLoading ? "Enviando..." : "Enviar solicitação"}
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

          <button
            type="button"
            onClick={onOpenRejectModal}
            disabled={actionLoading}
          >
            Rejeitar
          </button>
        </>
      )}

      {userRole === "FINANCEIRO" && status === "APROVADO" && (
        <button type="button">Marcar como paga</button>
      )}
    </section>
  )
}