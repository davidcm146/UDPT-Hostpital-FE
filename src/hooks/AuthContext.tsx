import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Role } from "@/types/user"
import type { DecodedToken } from "@/types/auth"
import { authService } from "@/services/authService"

type AuthContextType = {
  user: DecodedToken | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  hasRole: (role: Role) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedToken | null>(null)

const [isLoading, setIsLoading] = useState(true) // ⬅️ thêm

useEffect(() => {
  const token = Cookies.get("token")
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      setUser(decoded)
    } catch (err) {
      console.error("Invalid token:", err)
      Cookies.remove("token")
    }
  }
  setIsLoading(false) // ⬅️ luôn gọi sau khi xử lý token
}, [])

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password })
    if (res.success && res.user) {
      setUser(res.user)
    } else {
      throw new Error(res.message || "Login failed")
    }
  }

  const logout = () => {
    Cookies.remove("token")
    setUser(null)
  }

  const hasRole = (role: Role) => {
    return user?.role === role
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
