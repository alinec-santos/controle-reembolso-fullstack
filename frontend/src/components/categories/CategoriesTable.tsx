import type { Category } from "../../types/category"

type Props = {
  categories: Category[]
  loading: boolean
  onEdit: (category: Category) => void
}

export function CategoriesTable({ categories, loading, onEdit }: Props) {
  return (
    <section>
      <h2>Categorias cadastradas</h2>

      {loading && <p>Carregando categorias...</p>}

      {!loading && categories.length === 0 && (
        <p>Nenhuma categoria encontrada.</p>
      )}

      {!loading && categories.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Status</th>
              <th>Criada em</th>
              <th>Atualizada em</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.active ? "Ativa" : "Inativa"}</td>
                <td>{category.createdAt}</td>
                <td>{category.updatedAt}</td>
                <td>
                  <button type="button" onClick={() => onEdit(category)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}