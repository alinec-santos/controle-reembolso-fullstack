import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Login } from "../pages/Login"
import { Dashboard } from "../pages/Dashboard"

export function AppRoutes() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Login />
  }

  return <Dashboard />
}