import React, { createContext, useContext, useState, ReactNode } from 'react';
import { login } from '../services/api';
import { Redirect, router } from 'expo-router';

interface User {
  id_ixc: number;
  email: string;
  nome: string;
  access_token: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn(email: string, password: string): Promise<void>; // Mudamos para não retornar boolean
  signOut(): void;
  clearError(): void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(email: string, password: string): Promise<void> {
    console.log('🔐 Tentativa de login com:', email);
    setLoading(true);
    setError(null);
    
    try {
      const response = await login(email, password);
      console.log('✅ Resposta da API:', response);
      if (response.access_token) {
        setUser({
          id_ixc: response.id_ixc,
          email: response.email,
          nome: response.nome,
          access_token: response.access_token
        });
        console.log('👤 Usuário definido no contexto');
        router.replace('/(tabs)/home');
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Erro no login:', err);
      throw err; // Rejeita a promise para ser tratada no LoginScreen
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    setUser(null);
  }

  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider value={{ 
      signed: !!user, 
      user, 
      loading,
      error,
      signIn, 
      signOut,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}