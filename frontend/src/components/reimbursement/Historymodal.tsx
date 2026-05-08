import type { History } from "../../types/reimbursement"

type Props = {
  open: boolean
  histories?: History[]
  onClose: () => void
}

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C13227]">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

function getActionStyle(action: string) {
  switch (action) {
    case "APPROVED":
      return {
        badge: "bg-emerald-50 text-emerald-600 font-bold",
        icon: (
          <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center bg-white z-10 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )
      }
    case "UPDATED":
      return {
        badge: "bg-orange-50 text-orange-600 font-bold",
        icon: (
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white z-10 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </div>
        )
      }
    case "CREATED":
      return {
        badge: "bg-red-50 text-red-600 font-bold",
        icon: (
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white z-10 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        )
      }
    default:
      return {
        badge: "bg-gray-100 text-gray-600 font-bold",
        icon: (
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white z-10 shrink-0">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          </div>
        )
      }
  }
}

export function HistoryModal({ open, histories, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[800px] overflow-hidden flex flex-col h-fit max-h-[85vh]">
        
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <HistoryIcon />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Histórico de Auditoria</h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Acompanhamento de todas as ações da solicitação</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 border border-gray-200 bg-white transition-colors p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!histories || histories.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Nenhum histórico encontrado.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-xs font-bold tracking-wider text-slate-500 uppercase whitespace-nowrap">
                      Data / Hora
                    </th>
                    <th className="px-4 py-3 text-xs font-bold tracking-wider text-slate-500 uppercase whitespace-nowrap">
                      Usuário
                    </th>
                    <th className="px-4 py-3 text-xs font-bold tracking-wider text-slate-500 uppercase whitespace-nowrap">
                      Ação
                    </th>
                    <th className="px-4 py-3 text-xs font-bold tracking-wider text-slate-500 uppercase">
                      Observação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {histories.map((history) => {
                    const style = getActionStyle(history.action)
                    return (
                      <tr key={history.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                          {history.createdAt}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-slate-800 whitespace-nowrap">
                          {history.user?.name ?? "Sistema"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase ${style.badge}`}>
                            {history.action}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-slate-700 min-w-[200px]">
                          {history.observation ? history.observation : <span className="text-gray-400 italic">Sem observação</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}