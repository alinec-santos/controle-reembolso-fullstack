import type { History } from "../../types/reimbursement"

type Props = {
  open: boolean
  histories?: History[]
  onClose: () => void
}

export function HistoryModal({ open, histories, onClose }: Props) {
  if (!open) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "1.5rem",
          width: 420,
          maxHeight: "80vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>Histórico da solicitação</h3>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        {!histories || histories.length === 0 ? (
          <p>Nenhum histórico encontrado.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            {histories.map((history) => (
              <li key={history.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                <p style={{ margin: "0 0 4px" }}><strong>Ação:</strong> {history.action}</p>
                <p style={{ margin: "0 0 4px" }}><strong>Usuário:</strong> {history.user?.name ?? "Usuário não informado"}</p>
                <p style={{ margin: "0 0 4px" }}><strong>Data/hora:</strong> {history.createdAt}</p>
                {history.observation && (
                  <p style={{ margin: 0 }}><strong>Observação:</strong> {history.observation}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}