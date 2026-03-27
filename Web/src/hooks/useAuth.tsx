import { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  apiAccessEnabled: boolean;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ideacatalyst_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        localStorage.removeItem("ideacatalyst_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("http://localhost:5068/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      
    });


    if (!response.ok) {
      let message = "Login falhou";
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const errorBody = await response.json();
        message = (errorBody && (errorBody.message || errorBody.error || errorBody.title)) || message;
      } else {
        const text = await response.text();
        message = text || message;
      }

      throw new Error(message);
    }

    const data = await response.json();
    localStorage.setItem("ideacatalyst_user", JSON.stringify(data.user));
    setUser(data.user as User);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch("http://localhost:5068/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registro falhou");
    }
  };

  const logout = () => {
    localStorage.removeItem("ideacatalyst_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }
  return context;
}
