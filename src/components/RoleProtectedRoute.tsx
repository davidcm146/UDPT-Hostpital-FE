import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/AuthContext"
import type { Role } from "@/types/user"

interface Props {
  allowedRoles: Role[]
  children: React.ReactNode
}

export default function RoleProtectedRoute ({ allowedRoles }: Props) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user?.role as Role)) return <Navigate to="/" replace />

  return <Outlet/>
}
