import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService, User } from "../services/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await apiService.getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.login(email, password);
      if (response.success && response.token && response.user) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message || "Login failed" };
    } catch (error: any) {
      return { success: false, message: error.message || "Login failed" };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.register(name, email, password);
      if (response.success && response.token && response.user) {
        localStorage.setItem("token", response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message || "Registration failed" };
    } catch (error: any) {
      return { success: false, message: error.message || "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
