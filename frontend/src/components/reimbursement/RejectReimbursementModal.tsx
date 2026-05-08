import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const rejectSchema = z.object({
  reason: z
    .string()
    .min(5, "Justificativa deve ter pelo menos 5 caracteres"),
})

type RejectFormData = z.infer<typeof rejectSchema>

type Props = {
  open: boolean
  actionLoading: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

export function RejectReimbursementModal({
  open,
  actionLoading,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectFormData>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      reason: "",
    },
  })

  if (!open) return null

  function handleClose() {
    reset()
    onClose()
  }

  function submit(data: RejectFormData) {
    onSubmit(data.reason)
    reset()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[540px] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-[#C13227]">
              <XCircleIcon />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Rejeitar Solicitação</h2>
          </div>
          <button 
            type="button" 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-md hover:bg-gray-50 focus:outline-none"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col">
          <div className="p-7 space-y-6">
            
            {/* Attention Box */}
            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex gap-3">
              <div className="text-[#C13227] mt-0.5">
                <AlertIcon />
              </div>
              <p className="text-[15px] font-medium text-slate-700 leading-relaxed">
                Atenção: Ao rejeitar esta solicitação, o colaborador será notificado e a despesa não será reembolsada.
              </p>
            </div>

            {/* Field */}
            <div className="space-y-2.5">
              <label htmlFor="reason" className="text-[15px] font-bold text-slate-800 ml-0.5">
                Justificativa da rejeição <span className="text-[#C13227]">*</span>
              </label>
              
              <textarea
                id="reason"
                aria-label="Justificativa"
                className="flex w-full min-h-[140px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-[16px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C13227]/20 focus:border-[#C13227] transition-all shadow-sm resize-none"
                placeholder="Escreva o motivo detalhado para a rejeição da despesa..."
                {...register("reason")}
              />
              
              {errors.reason && (
                <p className="text-sm text-red-500 font-bold ml-1">{errors.reason.message}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-7 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <button 
              type="button" 
              onClick={handleClose}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[15px] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={actionLoading}
              aria-label="Rejeitar solicitação"
              className="bg-[#C13227] hover:bg-[#a62b21] text-white px-8 py-3 rounded-xl font-bold text-[15px] shadow-[0_4px_12_0_rgba(193,50,39,0.3)] transition-all flex items-center gap-2.5 disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-[#C13227]/30"
            >
              {actionLoading ? (
                 "Rejeitando..."
              ) : (
                <>
                  <XCircleIcon className="w-5 h-5" />
                  Rejeitar Solicitação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}