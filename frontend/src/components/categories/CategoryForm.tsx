import type { FieldErrors, UseFormRegister } from "react-hook-form"

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
    <section className="bg-white rounded-lg shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 p-8 mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-gray-100">
        {isEditing ? "Editar categoria" : "Criar categoria"}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1 w-full space-y-2">
            <label htmlFor="name" className="text-base font-semibold text-slate-700">Nome</label>
            <input 
              id="name" 
              type="text" 
              className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
              placeholder="Digite o nome da categoria"
              {...register("name")} 
            />
            {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col space-y-2 w-full md:w-auto mt-2 md:mt-0">
            <span className="text-base font-semibold text-slate-700">Status</span>
            <label htmlFor="active" className="flex items-center cursor-pointer h-12">
              <div className="relative flex items-center">
                <input id="active" type="checkbox" className="sr-only peer" {...register("active")} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#C13227] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C13227]"></div>
              </div>
              <span className="ml-3 text-base font-medium text-slate-700">
                Ativa
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4">
          {isEditing && (
            <button 
              type="button" 
              onClick={onCancelEdit}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Cancelar edição
            </button>
          )}
          <button 
            type="submit" 
            disabled={actionLoading}
            className="w-full sm:w-auto bg-[#C13227] hover:bg-[#a62b21] text-white px-6 py-3 rounded-md font-semibold text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {actionLoading
              ? "Salvando..."
              : isEditing
                ? "Salvar edição"
                : <><span className="text-xl leading-none mb-[2px]">+</span> Criar categoria</>}
          </button>
        </div>
      </form>
    </section>
  )
}