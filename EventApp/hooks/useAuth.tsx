import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import * as authLib from "@/lib/auth";
import { User, AuthContextType } from "@/lib/types";
import api from "@/lib/api";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await authLib.getToken();
      const u = await authLib.getStoredUser();
      if (t && u) { setToken(t); setUser(u); }
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authLib.login(email, password);
    setToken(data.token);
    setUser(data.user);
    router.replace("/(tabs)/home");
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authLib.register(name, email, password);
    setToken(data.token);
    setUser(data.user);
    router.replace("/(tabs)/home");
  };

  const logout = async () => {
    await authLib.logout();
    setUser(null);
    setToken(null);
    router.replace("/auth/login");
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
