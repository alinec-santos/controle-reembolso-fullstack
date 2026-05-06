import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Login } from "../pages/Login"
import { Dashboard } from "../pages/Dashboard"
import { CreateReimbursement } from "../pages/CreateReimbursement"

export function AppRoutes() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/reimbursements/new" element={<CreateReimbursement />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}