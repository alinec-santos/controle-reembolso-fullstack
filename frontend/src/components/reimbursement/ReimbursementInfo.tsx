import type { Reimbursement } from "../../pages/ReimbursementDetail"

type Props = {
  request: Reimbursement
}

export function ReimbursementInfo({ request }: Props) {
  return (
    <section>
      <h2>Informações da solicitação</h2>

      <p>
        <strong>Descrição:</strong> {request.description}
      </p>

      <p>
        <strong>Categoria:</strong> {request.category?.name ?? "Sem categoria"}
      </p>

      <p>
        <strong>Valor:</strong> R$ {Number(request.amount).toFixed(2)}
      </p>

      <p>
        <strong>Status:</strong> {request.status}
      </p>

      <p>
        <strong>Data da despesa:</strong> {request.expenseDate}
      </p>

      <p>
        <strong>Criada em:</strong> {request.createdAt}
      </p>

      <p>
        <strong>Atualizada em:</strong> {request.updatedAt}
      </p>

      {request.user && (
        <>
          <p>
            <strong>Solicitante:</strong> {request.user.name}
          </p>

          <p>
            <strong>Email:</strong> {request.user.email}
          </p>

          <p>
            <strong>Perfil:</strong> {request.user.role}
          </p>
        </>
      )}

      {request.rejectionReason && (
        <p>
          <strong>Motivo da rejeição:</strong> {request.rejectionReason}
        </p>
      )}
    </section>
  )
}