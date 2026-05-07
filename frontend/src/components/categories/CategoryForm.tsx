import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form"

type CategoryFormData = {
  name: string
  active: boolean
}

type Props = {
  isEditing: boolean
  actionLoading: boolean
  register: UseFormRegister<CategoryFormData>
  errors: FieldErrors<CategoryFormData>
  onSubmit: () => void
  onCancelEdit: () => void
}

export function CategoryForm({
  isEditing,
  actionLoading,
  register,
  errors,
  onSubmit,
  onCancelEdit,
}: Props) {
  return (
    <section>
      <h2>{isEditing ? "Editar categoria" : "Criar categoria"}</h2>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Nome</label>

          <input id="name" type="text" {...register("name")} />

          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="active">Ativa</label>

          <input id="active" type="checkbox" {...register("active")} />
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