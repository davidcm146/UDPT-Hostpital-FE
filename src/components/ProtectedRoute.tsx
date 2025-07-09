import { Navigate, Outlet, useLocation } from "react-router-dom"
import Cookies from "js-cookie"

export default function ProtectedRoute() {
  const token = Cookies.get("token")
  const location = useLocation()

  if (!token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <Outlet />
}
