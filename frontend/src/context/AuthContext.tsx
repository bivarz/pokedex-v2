"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const isAuth = !!token;
    setIsAuthenticated(isAuth);
    setIsLoading(false);

    if (isAuth && pathname === "/login") {
      router.replace("/");
    } else if (!isAuth && pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router]);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    if (username === "admin" && password === "admin") {
      localStorage.setItem("auth-token", "authenticated");
      setIsAuthenticated(true);
      router.replace("/");
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    setIsAuthenticated(false);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
