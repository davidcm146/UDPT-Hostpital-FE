import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/AuthContext"

export default function RedirectIfAuthenticated() {
  const { user } = useAuth()

  if (user) {
    // Redirect theo role
    switch (user.role) {
      case "DOCTOR":
        return <Navigate to="/doctor" replace />
      case "RECEPTIONIST":
        return <Navigate to="/receptionist" replace />
      case "ADMIN":
        return <Navigate to="/admin" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return <Outlet />
}
