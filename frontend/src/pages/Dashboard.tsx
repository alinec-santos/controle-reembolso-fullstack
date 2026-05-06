import { useAuth } from "../contexts/AuthContext"

export function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <main>
      <h1>Dashboard</h1>

      <p>Bem-vindo(a), {user?.name}</p>
      <p>Perfil: {user?.role}</p>

      <button onClick={logout}>Sair</button>
    </main>
  )
}