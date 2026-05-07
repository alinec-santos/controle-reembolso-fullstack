type Props = {
  onOpenModal: () => void
}

export function HistorySection({ onOpenModal }: Props) {
  return (
    <section>
      <h2>Histórico da solicitação</h2>
      <button type="button" onClick={onOpenModal}>
        Visualizar histórico
      </button>
    </section>
  )
}