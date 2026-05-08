import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "../contexts/AuthContext"
import { getApiErrorMessage } from "../utils/getApiErrorMessage"

const loginSchema = z.object({
  email: z
    .string()
    .email("Informe um e-mail válido")
    .refine((email) => email.includes("."), "Informe um e-mail válido"),
  password: z.string().min(1, "Informe a senha"),
})

type LoginFormData = z.infer<typeof loginSchema>

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
)

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export function Login() {
  const { login } = useAuth()

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormData) {
    try {
      setIsLoading(true)
      setError("")

      await login(data)
    } catch (error) {
      setError(getApiErrorMessage(error, "Email ou senha inválidos"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden font-sans bg-gradient-to-br from-[#c62828] via-[#a11c1c] to-[#7f1313]">

      {/* Background Graphic Elements to simulate the image */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay">
        <img src="/pitang-logo-semfundo.png" alt="" className="w-[150%] h-[150%] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="w-full max-w-[540px] relative z-10 px-4 mb-16">
        <div className="bg-white rounded-[2rem] shadow-2xl p-12 md:p-14 w-full flex flex-col items-center">

          <div className="mb-10 flex flex-col items-center">
            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-red-50/50 p-3 mb-5">
              <img src="/pitang-logo.png" alt="Pitang Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-[16px] font-bold text-gray-500 tracking-widest uppercase">Controle de Reembolsos</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 w-full">
            <div className="space-y-2 w-full">
              <label htmlFor="email" className="text-[15px] font-bold text-slate-800 ml-1">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon />
                </div>
                <input
                  id="email"
                  type="email"
                  className="flex h-[56px] w-full rounded-xl border border-slate-200 bg-gray-50/50 pl-12 pr-4 py-2 text-[16px] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-all shadow-sm"
                  placeholder="user@pitang.com"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 w-full">
              <label htmlFor="password" className="text-[15px] font-bold text-slate-800 ml-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="flex h-[56px] w-full rounded-xl border border-slate-200 bg-gray-50/50 pl-12 pr-12 py-2 text-[16px] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C13227] focus:border-transparent transition-all shadow-sm tracking-widest font-mono"
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center focus:outline-none"
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
            </div>



            {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}

            <div className="pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-[60px] w-full items-center justify-center rounded-xl bg-[#b52a2a] px-4 py-2 text-[18px] font-bold text-white transition-colors hover:bg-[#962121] focus:outline-none focus:ring-4 focus:ring-[#b52a2a]/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(181,42,42,0.39)]"
              >
                {isLoading ? "Entrando..." : (
                  <>
                    Entrar na Plataforma <ArrowRightIcon />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-6 w-full text-center z-10 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-[12px] font-medium text-white/70">
        <span>© 2026 Pitang Agile IT. Todos</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
        <span>Todos os direitos reservados.</span>
      </div>
    </main>
  )
}