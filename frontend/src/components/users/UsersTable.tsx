import type { User } from "../../types/Users"

type Props = {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
}

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export function UsersTable({ users, loading, onEdit }: Props) {
  return (
    <section className="bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Usuários cadastrados</h2>
        
        <div className="relative w-full sm:w-64">
           <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
             <SearchIcon />
           </div>
           <input 
             type="text" 
             className="bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C13227] focus:border-[#C13227] block w-full pl-10 p-2.5" 
             placeholder="Buscar usuário..." 
             readOnly 
           />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading && <p className="p-6 text-gray-500 text-center text-base font-medium">Carregando usuários...</p>}

        {!loading && users.length === 0 && (
          <p className="p-10 text-gray-500 text-center text-base font-medium">Nenhum usuário encontrado.</p>
        )}

        {!loading && users.length > 0 && (
          <table className="w-full text-base text-left text-slate-600">
            <thead className="text-sm text-white bg-[#C13227] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Nome</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Perfil</th>
                <th className="px-6 py-4 font-semibold">Criado em</th>
                <th className="px-6 py-4 font-semibold">Atualizado em</th>
                <th className="px-6 py-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1.5 text-xs font-bold uppercase rounded-md tracking-wider">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.createdAt}</td>
                  <td className="px-6 py-4">{user.updatedAt}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      type="button" 
                      onClick={() => onEdit(user)}
                      className="text-slate-500 hover:text-[#C13227] hover:bg-red-50 p-2 rounded-full transition-colors inline-flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-red-200"
                      title="Editar"
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}