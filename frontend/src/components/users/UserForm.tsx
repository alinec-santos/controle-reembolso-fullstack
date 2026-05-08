import type { FieldErrors, UseFormRegister } from "react-hook-form"

type UserFormData = {
  name: string
  email: string
  password: string
  role: "COLABORADOR" | "GESTOR" | "FINANCEIRO" | "ADMIN"
}

type Props = {
  isEditing: boolean
  actionLoading: boolean
  register: UseFormRegister<UserFormData>
  errors: FieldErrors<UserFormData>
  onSubmit: () => void
  onCancelEdit: () => void
}

const roles = ["COLABORADOR", "GESTOR", "FINANCEIRO", "ADMIN"] as const

export function UserForm({
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
        {isEditing ? "Editar usuário" : "Criar usuário"}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="text-base font-semibold text-slate-700">Nome</label>
            <input 
              id="name" 
              type="text" 
              className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
              placeholder="Digite o nome"
              {...register("name")} 
            />
            {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-base font-semibold text-slate-700">Email</label>
            <input 
              id="email" 
              type="email" 
              className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
              placeholder="email@pitang.com"
              {...register("email")} 
            />
            {errors.email && <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-base font-semibold text-slate-700 whitespace-nowrap">
              Senha {isEditing && <span className="text-xs text-gray-500 font-normal ml-1">(opcional)</span>}
            </label>
            <input 
              id="password" 
              type="password" 
              className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm"
              placeholder="••••••••"
              {...register("password")} 
            />
            {errors.password && <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="role" className="text-base font-semibold text-slate-700">Perfil</label>
            <select 
              id="role" 
              className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-colors shadow-sm cursor-pointer"
              {...register("role")}
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <p className="text-sm text-red-500 font-medium">{errors.role.message}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-2">
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
                : <><span aria-hidden="true" className="text-xl leading-none mb-[2px]">+</span> Criar usuário</>}
          </button>
        </div>
      </form>
    </section>
  )
}