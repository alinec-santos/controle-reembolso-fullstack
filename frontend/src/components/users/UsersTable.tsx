import type { User } from "../../types/Users"

type Props = {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
}

export function UsersTable({ users, loading, onEdit }: Props) {
  return (
    <section>
      <h2>Usuários cadastrados</h2>

      {loading && <p>Carregando usuários...</p>}

      {!loading && users.length === 0 && <p>Nenhum usuário encontrado.</p>}

      {!loading && users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Criado em</th>
              <th>Atualizado em</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.createdAt}</td>
                <td>{user.updatedAt}</td>
                <td>
                  <button type="button" onClick={() => onEdit(user)}>
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