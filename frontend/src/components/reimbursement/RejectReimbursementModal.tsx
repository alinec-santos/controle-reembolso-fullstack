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
    <div>
      <h3>Rejeitar solicitação</h3>

      <form onSubmit={handleSubmit(submit)}>
        <div>
          <label htmlFor="reason">Justificativa</label>

          <textarea
            id="reason"
            placeholder="Informe o motivo da rejeição"
            rows={5}
            {...register("reason")}
          />

          {errors.reason && <p>{errors.reason.message}</p>}
        </div>

        <button type="button" onClick={handleClose}>
          Cancelar
        </button>

        <button type="submit" disabled={actionLoading}>
          {actionLoading ? "Rejeitando..." : "Rejeitar solicitação"}
        </button>
      </form>
    </div>
  )
}