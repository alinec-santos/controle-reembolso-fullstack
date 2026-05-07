import { FormEvent } from "react"

type Props = {
  isEditing: boolean
  actionLoading: boolean
  name: string
  active: boolean
  onChangeName: (value: string) => void
  onChangeActive: (value: boolean) => void
  onSubmit: (event: FormEvent) => void
  onCancelEdit: () => void
}

export function CategoryForm({
  isEditing,
  actionLoading,
  name,
  active,
  onChangeName,
  onChangeActive,
  onSubmit,
  onCancelEdit,
}: Props) {
  return (
    <section>
      <h2>{isEditing ? "Editar categoria" : "Criar categoria"}</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => onChangeName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="active">Ativa</label>
          <input
            id="active"
            type="checkbox"
            checked={active}
            onChange={(event) => onChangeActive(event.target.checked)}
          />
        </div>

        <button type="submit" disabled={actionLoading}>
          {actionLoading
            ? "Salvando..."
            : isEditing
              ? "Salvar edição"
              : "Criar categoria"}
        </button>

        {isEditing && (
          <button type="button" onClick={onCancelEdit}>
            Cancelar edição
          </button>
        )}
      </form>
    </section>
  )
}