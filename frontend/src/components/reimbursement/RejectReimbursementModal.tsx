type Props = {
  open: boolean
  reason: string
  actionLoading: boolean
  onClose: () => void
  onSubmit: () => void
  onChangeReason: (value: string) => void
}

export function RejectReimbursementModal({
  open,
  reason,
  actionLoading,
  onClose,
  onSubmit,
  onChangeReason,
}: Props) {
  if (!open) return null

  return (
    <div>
      <h3>Rejeitar solicitação</h3>

      <div>
        <label htmlFor="reason">Justificativa</label>

        <textarea
          id="reason"
          value={reason}
          onChange={(event) => onChangeReason(event.target.value)}
          placeholder="Informe o motivo da rejeição"
          rows={5}
        />
      </div>

      <button type="button" onClick={onClose}>
        Cancelar
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={actionLoading || !reason.trim()}
      >
        {actionLoading ? "Rejeitando..." : "Rejeitar solicitação"}
      </button>
    </div>
  )
}