import type { Attachment } from "../../types/reimbursement"

type Props = {
  attachments?: Attachment[]
  userRole?: string
  status: string
  onOpenModal: () => void
}

export function AttachmentsSection({ attachments, userRole, status, onOpenModal }: Props) {
  return (
    <section>
      <h2>Anexos</h2>

      {!attachments || attachments.length === 0 ? (
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

      {userRole === "COLABORADOR" && status === "RASCUNHO" && (
        <button type="button" onClick={onOpenModal}>
          Adicionar anexo
        </button>
      )}
    </section>
  )
}