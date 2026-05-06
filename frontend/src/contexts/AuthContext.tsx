import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../api/api"
import type { User } from "../types"

// 1. Definição do formato dos dados de login e do contexto
type LoginData = {
  email: string
  password: string
}

type AuthContextData = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean // Essencial para tratar o estado de carregamento no frontend
  login: (data: LoginData) => Promise<void>
  logout: () => void
}

// Inicializa o contexto com um objeto vazio tipado
const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Começa como true para validar o token ao abrir o app
  const [token, setToken] = useState<string | null>(() => {
    // Busca o token no armazenamento local para manter a sessão ativa após Refresh
    return localStorage.getItem("@reembolso:token")
  })

  // Booleano derivado: true se houver usuário E token
  const isAuthenticated = !!user && !!token

  useEffect(() => {
    // 2. Sempre que o app inicia ou o token muda, configura o Axios
    if (token) {
      // Injeta o JWT automaticamente em todas as futuras chamadas à API
      api.defaults.headers.common.Authorization = `Bearer ${token}`
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  // 3. Busca dados do usuário logado para validar se o token ainda é válido
  async function loadUser() {
    try {
      const response = await api.get("/auth/me")
      setUser(response.data)
    } catch (error) {
      // Se a API falhar (ex: token expirado), limpa a sessão
      logout()
    } finally {
      setLoading(false)
    }
  }

  // 4. Realiza a autenticação e salva o estado globalmente
  async function login(data: LoginData) {
    try {
      const response = await api.post("/auth/login", data)
      const { token, user } = response.data

      // Persistência: salva no navegador e configura o cabeçalho da API
      localStorage.setItem("@reembolso:token", token)
      api.defaults.headers.common.Authorization = `Bearer ${token}`

      setToken(token)
      setUser(user)
    } catch (error) {
      // Importante: no seu formulário, você deve capturar esse erro para exibir ao usuário
      console.error("Erro ao fazer login:", error)
      throw error // Repassa o erro para o componente de Login tratar o visual
    }
  }

  // 5. Limpa todos os rastros da sessão (Segurança)
  function logout() {
    localStorage.removeItem("@reembolso:token")
    delete api.defaults.headers.common.Authorization

    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout
      }}
    >
      {/* 6. Context API: provê o estado global para todos os componentes filhos*/}
      {children}
    </AuthContext.Provider>
  )
}

// 7. Hook customizado para facilitar o acesso aos dados em qualquer tela
export function useAuth() {
  return useContext(AuthContext)
}