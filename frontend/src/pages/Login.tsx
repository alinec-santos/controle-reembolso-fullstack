import { FormEvent, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export function Login() {
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      setError("")

      await login({
        email,
        password
      })
    } catch {
      setError("Email ou senha inválidos")
    }
  }

  return (
    <main>
      <h1>Controle de Reembolso</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="admin@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="123456"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Entrar</button>
      </form>
    </main>
  )
}