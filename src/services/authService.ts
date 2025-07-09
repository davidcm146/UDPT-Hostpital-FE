import { SignUpResponse, SignupPayload, LoginPayRequest, DecodedToken } from "@/types/auth"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import { Response } from "@/types/api"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export const authService = {
  async register(payload: SignupPayload): Promise<SignUpResponse> {
    try {
      const res = await fetch(`${BASE_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json: Response<SignupPayload> = await res.json();

      if (json.code !== 200) {
        throw new Error(json.message || "Fail to sign up")
      }

      return {
        success: true,
        message: json.message,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      }
    }
  },


  async login(payload: LoginPayRequest): Promise<{
    success: boolean
    token?: string
    user?: DecodedToken
    message?: string
  }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json: Response<{
        accessToken: string
        refreshToken: string | null | undefined
      }> = await res.json()

      if (json.code !== 200) {
        throw new Error(json.message || "Login failed")
      }

      let accessToken: string | undefined = "";

      if (!Array.isArray(json.data)) {
        accessToken = json?.data?.accessToken
      }

      if (!accessToken) throw new Error("No access token returned")

      Cookies.set("token", accessToken, { expires: 7 })
      const decoded = jwtDecode<DecodedToken>(accessToken)

      return {
        success: true,
        token: accessToken,
        user: decoded,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Unknown error",
      }
    }
  }
}
