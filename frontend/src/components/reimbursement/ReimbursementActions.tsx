type Props = {
  userRole?: string
  requestStatus: string
  actionLoading: boolean
  onSubmitRequest: () => Promise<void>
}

export function ReimbursementActions({
  userRole,
  requestStatus,
  actionLoading,
  onSubmitRequest,
}: Props) {
  return (
    <section>
      <h2>Ações disponíveis</h2>

      {userRole === "COLABORADOR" && requestStatus === "RASCUNHO" && (
        <>
          <button type="button">Editar solicitação</button>

          <button
            type="button"
            onClick={onSubmitRequest}
            disabled={actionLoading}
          >
            {actionLoading ? "Enviando..." : "Enviar solicitação"}
          </button>

          <button type="button">Cancelar solicitação</button>
        </>
      )}

      {userRole === "COLABORADOR" && requestStatus === "ENVIADO" && (
        <button type="button">Cancelar solicitação</button>
      )}

      {userRole === "GESTOR" && requestStatus === "ENVIADO" && (
        <>
          <button type="button">Aprovar</button>
          <button type="button">Rejeitar</button>
        </>
      )}

      {userRole === "FINANCEIRO" && requestStatus === "APROVADO" && (
        <button type="button">Marcar como paga</button>
      )}
    </section>
  )
}