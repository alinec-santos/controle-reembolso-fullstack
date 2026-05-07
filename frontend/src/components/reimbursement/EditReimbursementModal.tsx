import type { Category } from "../../types"

type Props = {
  open: boolean
  categories: Category[]
  actionLoading: boolean
  categoryId: string
  description: string
  amount: string
  expenseDate: string
  onClose: () => void
  onSubmit: () => void
  onChangeCategoryId: (value: string) => void
  onChangeDescription: (value: string) => void
  onChangeAmount: (value: string) => void
  onChangeExpenseDate: (value: string) => void
}

export function EditReimbursementModal({
  open,
  categories,
  actionLoading,
  categoryId,
  description,
  amount,
  expenseDate,
  onClose,
  onSubmit,
  onChangeCategoryId,
  onChangeDescription,
  onChangeAmount,
  onChangeExpenseDate,
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
          width: 420,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>Editar solicitação</h3>

          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div>
          <label htmlFor="editCategoryId">Categoria</label>
          <select
            id="editCategoryId"
            value={categoryId}
            onChange={(event) => onChangeCategoryId(event.target.value)}
          >
            <option value="">Selecione uma categoria</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="editDescription">Descrição</label>
          <input
            id="editDescription"
            type="text"
            value={description}
            onChange={(event) => onChangeDescription(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="editAmount">Valor</label>
          <input
            id="editAmount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(event) => onChangeAmount(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="editExpenseDate">Data da despesa</label>
          <input
            id="editExpenseDate"
            type="date"
            value={expenseDate}
            onChange={(event) => onChangeExpenseDate(event.target.value)}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={
              actionLoading ||
              !categoryId ||
              !description ||
              !amount ||
              !expenseDate
            }
          >
            {actionLoading ? "Salvando..." : "Salvar edição"}
          </button>
        </div>
      </div>
    </div>
  )
}