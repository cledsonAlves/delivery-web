import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Cliente } from '../types';

interface AuthContextType {
  cliente: Cliente | null;
  isAuthenticated: boolean;
  login: (cliente: Cliente) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  cliente: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    // Carregar cliente do localStorage ao iniciar
    const clienteStr = localStorage.getItem('cliente');
    if (clienteStr) {
      try {
        const clienteData = JSON.parse(clienteStr);
        setCliente(clienteData);
      } catch (err) {
        console.error('Erro ao carregar cliente do localStorage:', err);
        localStorage.removeItem('cliente');
      }
    }
  }, []);

  const login = (clienteData: Cliente) => {
    setCliente(clienteData);
    localStorage.setItem('cliente', JSON.stringify(clienteData));
  };

  const logout = () => {
    setCliente(null);
    localStorage.removeItem('cliente');
  };

  return (
    <AuthContext.Provider
      value={{
        cliente,
        isAuthenticated: !!cliente,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
