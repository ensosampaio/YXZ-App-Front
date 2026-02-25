import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import type { UserDTO } from '@/types';

interface AuthContextData {
  user: UserDTO | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  

  const [user, setUser] = useState<UserDTO | null>(() => {
    try {
      const stored = localStorage.getItem('@YXZApp:user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('@YXZApp:user');
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    
    const { token, userId, nome, role, corAdministradora, ativo } = response.data;
    const loggedUser: UserDTO = { userId, nome, role, corAdministradora, ativo };
    
    localStorage.setItem('@YXZApp:token', token);
    localStorage.setItem('@YXZApp:user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem('@YXZApp:token');
    localStorage.removeItem('@YXZApp:user');
    setUser(null);
  };

  
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      window.location.href = '/'; // Força o redirecionamento para o Login
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;