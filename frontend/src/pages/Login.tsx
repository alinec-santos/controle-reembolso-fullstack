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

export function Login() {
  const { login } = useAuth()

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
    <main>
      <h1>Controle de Reembolso</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">E-mail</label>

          <input
            id="email"
            type="email"
            {...register("email")}
          />

          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Senha</label>

          <input
            id="password"
            type="password"
            {...register("password")}
          />

          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  )
}