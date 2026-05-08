import type { Attachment } from "../../types/reimbursement"

type Props = {
  attachments?: Attachment[]
  userRole?: string
  status: string
}

export function AttachmentsSection({ attachments, userRole, status }: Props) {
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

    </section>
  )
}