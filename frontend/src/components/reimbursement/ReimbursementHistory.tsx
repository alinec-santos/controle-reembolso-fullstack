import type { History } from "../../pages/ReimbursementDetail"

type Props = {
  histories: History[]
}

export function ReimbursementHistory({ histories }: Props) {
  return (
    <section>
      <h2>Histórico da solicitação</h2>

      {histories.length === 0 ? (
        <p>Nenhum histórico encontrado.</p>
      ) : (
        <ul>
          {histories.map((history) => (
            <li key={history.id}>
              <p>
                <strong>Ação:</strong> {history.action}
              </p>

              <p>
                <strong>Usuário:</strong>{" "}
                {history.user?.name ?? "Usuário não informado"}
              </p>

              <p>
                <strong>Data/hora:</strong> {history.createdAt}
              </p>

              {history.observation && (
                <p>
                  <strong>Observação:</strong> {history.observation}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}