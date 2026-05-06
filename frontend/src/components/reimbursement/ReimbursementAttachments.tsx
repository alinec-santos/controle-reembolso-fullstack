import { useState } from "react"
import type {
  Attachment,
  AttachmentFormData,
} from "../../pages/ReimbursementDetail"

type Props = {
  attachments: Attachment[]
  userRole?: string
  requestStatus: string
  actionLoading: boolean
  onAddAttachment: (data: AttachmentFormData) => Promise<void>
}

export function ReimbursementAttachments({
  attachments,
  userRole,
  requestStatus,
  actionLoading,
  onAddAttachment,
}: Props) {
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("")
  const [fileUrl, setFileUrl] = useState("")

  const canAddAttachment =
    userRole === "COLABORADOR" && requestStatus === "RASCUNHO"

  async function handleSubmit() {
    await onAddAttachment({
      fileName,
      fileType,
      fileUrl,
    })

    setFileName("")
    setFileType("")
    setFileUrl("")
  }

  return (
    <section>
      <h2>Anexos</h2>

      {attachments.length === 0 ? (
        <p>Nenhum anexo cadastrado.</p>
      ) : (
        <ul>
          {attachments.map((attachment) => (
            <li key={attachment.id}>
              <a href={attachment.fileUrl} target="_blank" rel="noreferrer">
                {attachment.fileName}
              </a>

              <span> - {attachment.fileType}</span>
            </li>
          ))}
        </ul>
      )}

      {canAddAttachment && (
        <div>
          <h3>Adicionar anexo</h3>

          <div>
            <label htmlFor="fileName">Nome do arquivo</label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              placeholder="ex: nota-fiscal.pdf"
            />
          </div>

          <div>
            <label htmlFor="fileType">Tipo do arquivo</label>
            <input
              id="fileType"
              type="text"
              value={fileType}
              onChange={(event) => setFileType(event.target.value)}
              placeholder="ex: application/pdf"
            />
          </div>

          <div>
            <label htmlFor="fileUrl">URL do arquivo</label>
            <input
              id="fileUrl"
              type="text"
              value={fileUrl}
              onChange={(event) => setFileUrl(event.target.value)}
              placeholder="ex: https://exemplo.com/nota.pdf"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={actionLoading || !fileName || !fileType || !fileUrl}
          >
            {actionLoading ? "Adicionando..." : "Adicionar anexo"}
          </button>
        </div>
      )}
    </section>
  )
}