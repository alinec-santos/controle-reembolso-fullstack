import { z } from "zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Category } from "../../types"

const editReimbursementSchema = z.object({
  categoryId: z.string().min(1, "Selecione uma categoria"),

  description: z
    .string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres"),

  amount: z.coerce
    .number()
    .positive("Valor deve ser maior que zero"),

  expenseDate: z
    .string()
    .min(1, "Informe a data da despesa"),
})

type EditReimbursementFormData = z.infer<
  typeof editReimbursementSchema
>

type Props = {
  open: boolean
  categories: Category[]
  actionLoading: boolean

  categoryId: string
  description: string
  amount: string
  expenseDate: string

  onClose: () => void

  onSubmit: (data: EditReimbursementFormData) => void
}

export function EditReimbursementModal({
  open,
  categories,
  actionLoading,

  categoryId,
  description,
  amount,
  expenseDate,

  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditReimbursementFormData>({
    resolver: zodResolver(editReimbursementSchema),

    defaultValues: {
      categoryId: "",
      description: "",
      amount: 0,
      expenseDate: "",
    },
  })

  useEffect(() => {
    reset({
      categoryId,
      description,
      amount: Number(amount),
      expenseDate,
    })
  }, [
    categoryId,
    description,
    amount,
    expenseDate,
    reset,
  ])

  if (!open) return null

  function handleClose() {
    reset()

    onClose()
  }

  function submit(data: EditReimbursementFormData) {
    onSubmit(data)
  }

  return (
    <div>
      <h3>Editar solicitação</h3>

      <form onSubmit={handleSubmit(submit)}>
        <div>
          <label htmlFor="categoryId">Categoria</label>

          <select
            id="categoryId"
            {...register("categoryId")}
          >
            <option value="">Selecione uma categoria</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {errors.categoryId && (
            <p>{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description">Descrição</label>

          <input
            id="description"
            type="text"
            {...register("description")}
          />

          {errors.description && (
            <p>{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount">Valor</label>

          <input
            id="amount"
            type="number"
            step="0.01"
            {...register("amount")}
          />

          {errors.amount && (
            <p>{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="expenseDate">
            Data da despesa
          </label>

          <input
            id="expenseDate"
            type="date"
            {...register("expenseDate")}
          />

          {errors.expenseDate && (
            <p>{errors.expenseDate.message}</p>
          )}
        </div>

        <button type="button" onClick={handleClose}>
          Cancelar
        </button>

        <button type="submit" disabled={actionLoading}>
          {actionLoading
            ? "Salvando..."
            : "Salvar edição"}
        </button>
      </form>
    </div>
  )
}