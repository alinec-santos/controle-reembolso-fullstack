type Props = {
  open: boolean
  actionLoading: boolean
  fileName: string
  fileType: string
  fileUrl: string
  onClose: () => void
  onSubmit: () => void
  onChangeFileName: (value: string) => void
  onChangeFileType: (value: string) => void
  onChangeFileUrl: (value: string) => void
}

export function AttachModal({
  open,
  actionLoading,
  fileName,
  fileType,
  fileUrl,
  onClose,
  onSubmit,
  onChangeFileName,
  onChangeFileType,
  onChangeFileUrl,
}: Props) {
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
          width: 380,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>Adicionar anexo</h3>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        <div>
          <label htmlFor="fileName">Nome do arquivo</label>
          <input
            id="fileName"
            type="text"
            value={fileName}
            onChange={(e) => onChangeFileName(e.target.value)}
            placeholder="ex: nota-fiscal.pdf"
          />
        </div>

        <div>
          <label htmlFor="fileType">Tipo do arquivo</label>
          <input
            id="fileType"
            type="text"
            value={fileType}
            onChange={(e) => onChangeFileType(e.target.value)}
            placeholder="ex: application/pdf"
          />
        </div>

        <div>
          <label htmlFor="fileUrl">URL do arquivo</label>
          <input
            id="fileUrl"
            type="text"
            value={fileUrl}
            onChange={(e) => onChangeFileUrl(e.target.value)}
            placeholder="ex: https://exemplo.com/nota.pdf"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onClose}>Cancelar</button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={actionLoading || !fileName || !fileType || !fileUrl}
          >
            {actionLoading ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  )
}