import type { Reimbursement } from "../../types/reimbursement"

type Props = {
  request: Reimbursement
  actionsSlot?: React.ReactNode
}

const statusColors: Record<string, string> = {
  RASCUNHO: "bg-orange-100 text-orange-600",
  ENVIADO: "bg-blue-100 text-blue-600",
  EM_ANALISE: "bg-purple-100 text-purple-600",
  APROVADO: "bg-green-100 text-green-600",
  REJEITADO: "bg-red-100 text-red-600",
  PAGO: "bg-emerald-100 text-emerald-600",
  CANCELADO: "bg-gray-100 text-gray-600"
}

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C13227]">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

export function ReimbursementInfo({ request, actionsSlot }: Props) {
  const statusColor = statusColors[request.status] || "bg-gray-100 text-gray-600"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 font-sans">
      <div className="flex flex-col gap-6 lg:col-span-2">
      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Informações</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 border-t border-gray-100 pt-6">
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Descrição</span>
            <p className="text-base font-semibold text-slate-800">{request.description}</p>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Categoria</span>
            <p className="text-base font-semibold text-slate-800">{request.category?.name ?? "Sem categoria"}</p>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Valor</span>
            <p className="text-base font-semibold text-slate-800">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(request.amount))}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Status</span>
            <div className="mt-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                {request.status === "RASCUNHO" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                )}
                {request.status}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Data da despesa</span>
            <p className="text-base font-semibold text-slate-800">{request.expenseDate}</p>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-medium text-slate-500">Criada em</span>
            <p className="text-base font-semibold text-slate-800">{request.createdAt}</p>
          </div>

          {request.rejectionReason && (
            <div className="space-y-1 md:col-span-2 mt-2 p-4 bg-red-50 rounded-lg border border-red-100">
              <span className="text-sm font-bold text-red-800">Motivo da rejeição</span>
              <p className="text-base font-medium text-red-600 mt-1">{request.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      {request.attachments && request.attachments.length > 0 && (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Anexos</h2>
          <ul className="space-y-3">
            {request.attachments.map(att => (
              <li key={att.id} className="flex justify-between items-center bg-gray-50/50 p-4 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-red-50 flex items-center justify-center shrink-0">
                    <FileTextIcon />
                  </div>
                  <div className="flex flex-col">
                    <a href={att.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-800 hover:text-[#C13227] transition-colors">
                      {att.fileName}
                    </a>
                    <span className="text-xs text-slate-500">{att.fileType}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>

      {request.user && (
        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-8 h-fit">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-gray-100 pb-6">Solicitante</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xl font-bold border border-gray-200 shadow-sm shrink-0">
                {request.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-base font-bold text-slate-800 truncate">{request.user.name}</span>
                <span className="text-sm font-medium text-slate-500 truncate">{request.user.email}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perfil</span>
              <p className="text-base font-bold text-slate-800 mt-1">{request.user.role}</p>
            </div>
          </div>
          {actionsSlot}
        </div>
      )}
      {!request.user && actionsSlot && (
        <div className="flex flex-col gap-4 lg:col-span-1">
          {actionsSlot}
        </div>
      )}
    </div>
  )
}