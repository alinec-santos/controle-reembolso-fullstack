import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { useAuth } from "../contexts/AuthContext"
import type { ReimbursementRequest } from "../types"

// Ícones inline para manter o código leve e fiel ao layout sem adicionar novas dependências
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

export function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [requests, setRequests] = useState<ReimbursementRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadRequests() {
    try {
      setIsLoading(true)
      setError("")

      const response = await api.get("/reimbursements")

      setRequests(response.data)
    } catch {
      setError("Erro ao carregar solicitações")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRequests = requests.filter(request => 
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    loadRequests()
  }, [])

  // Helper para estilizar os status conforme o design
  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APROVADO":
        return "bg-green-100 text-green-700"
      case "REJEITADO":
        return "bg-red-100 text-red-700"
      case "RASCUNHO":
        return "bg-gray-200 text-gray-600"
      case "EM_ANALISE":
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans">
      <header className="flex items-center justify-between px-6 md:px-8 py-5 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img src="/pitang-logo.png" alt="Pitang" className="h-9 object-contain" />
          <span className="text-[#C13227] font-semibold text-base md:text-lg border-l border-gray-300 pl-4">Dashboard</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-gray-700 hidden sm:block">Olá, {user?.name}!</span>
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-lg font-bold border border-gray-200 shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          
          <button 
            onClick={logout} 
            className="text-gray-500 hover:text-[#C13227] transition-colors flex items-center gap-2 text-base font-medium" 
            title="Sair"
          >
             <LogoutIcon /> <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Visão Geral</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            {user?.role === "COLABORADOR" && (
              <button 
                onClick={() => navigate("/reimbursements/new")} 
                className="bg-[#C13227] hover:bg-[#a62b21] text-white px-5 py-3 rounded-md font-semibold text-base flex items-center gap-2 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2"
              >
                <span className="text-xl leading-none mb-[2px]">+</span> Nova solicitação
              </button>
            )}

            {user?.role === "ADMIN" && (
              <>
                <button 
                  type="button" 
                  onClick={() => navigate("/users")} 
                  className="bg-[#C13227] hover:bg-[#a62b21] text-white px-5 py-3 rounded-md font-semibold text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2"
                >
                  Gerenciar usuários
                </button>
                <button 
                  onClick={() => navigate("/categories")} 
                  className="bg-[#C13227] hover:bg-[#a62b21] text-white px-5 py-3 rounded-md font-semibold text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2"
                >
                  Gerenciar categorias
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-[#C13227] p-6">
            <h2 className="text-base text-gray-500 mb-2 font-medium">Bem-vindo(a)</h2>
            <p className="text-2xl font-bold text-slate-800">{user?.name}</p>
          </div>
          <div className="bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 border-t-4 border-t-[#C13227] p-6">
            <h2 className="text-base text-gray-500 mb-2 font-medium">Perfil</h2>
            <p className="text-2xl font-bold text-slate-800 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>

        <section className="bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-800">Solicitações de reembolso</h2>
            
            <div className="relative w-full sm:w-64">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                 <SearchIcon />
               </div>
               <input 
                 type="text" 
                 className="bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C13227] focus:border-[#C13227] block w-full pl-10 p-2.5" 
                 placeholder="Pesquisar..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading && <p className="p-6 text-gray-500 text-center font-medium">Carregando solicitações...</p>}
            
            {error && <p className="p-6 text-red-500 text-center font-medium">{error}</p>}
            
            {!isLoading && !error && filteredRequests.length === 0 && (
              <p className="p-10 text-gray-500 text-center font-medium">Nenhuma solicitação encontrada.</p>
            )}

            {!isLoading && !error && filteredRequests.length > 0 && (
              <table className="w-full text-base text-left text-slate-600">
                <thead className="text-sm text-white bg-[#C13227] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Descrição</th>
                    <th className="px-6 py-4 font-semibold">Categoria</th>
                    <th className="px-6 py-4 font-semibold">Valor</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Data</th>
                    <th className="px-6 py-4 font-semibold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{request.description}</td>
                      <td className="px-6 py-4">{request.category?.name ?? "Sem categoria"}</td>
                      <td className="px-6 py-4 font-medium">R$ {Number(request.amount).toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md tracking-wider ${getStatusStyle(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(request.expenseDate).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => navigate(`/reimbursements/${request.id}`)}
                          className="text-[#C13227] hover:text-[#a62b21] hover:bg-red-50 p-2 rounded-full transition-colors inline-flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-red-200"
                          title="Ver detalhes"
                        >
                          <EyeIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}