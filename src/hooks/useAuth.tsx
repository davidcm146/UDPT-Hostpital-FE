import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  role: "admin" | "doctor" | "staff";
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setAccessToken(data.access_token);
      setUser(data.user);
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setAccessToken(null);
    setUser(null);
  };

  const refreshAccessToken = async () => {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setAccessToken(data.access_token);
      setUser(data.user);
    } else {
      setAccessToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
