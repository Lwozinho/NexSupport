import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Tipagem da resposta do Backend
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (credentials: SignInData) => Promise<void>;
  signOut: () => void;
  loading: boolean; // Novo: para saber se ainda está carregando dados do storage
}

// O que precisamos enviar para logar
interface SignInData {
  email: string;
  password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Ao carregar a página, verifica se já tem token salvo
  useEffect(() => {
    async function loadStorageData() {
      const storageUser = localStorage.getItem('@Auth:user');
      const storageToken = localStorage.getItem('@Auth:token');

      if (storageUser && storageToken) {
        // Se achou, reconecta o usuário automaticamente
        api.defaults.headers.common['Authorization'] = `Bearer ${storageToken}`;
        setUser(JSON.parse(storageUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  // 2. Função de Login Real
  async function signIn({ email, password }: SignInData) {
    
    // Chama o backend
    const response = await api.post('/session', {
      email,
      password
    });

    const { token, name, id, role } = response.data;

    // Monta o objeto usuário
    const userData = {
      id,
      name,
      email,
      role,
      token
    };

    // Salva no estado
    setUser(userData);

    // Configura o cabeçalho do Axios para as próximas chamadas
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Salva no LocalStorage (persistência)
    localStorage.setItem('@Auth:user', JSON.stringify(userData));
    localStorage.setItem('@Auth:token', token);
  }

  function signOut() {
    localStorage.removeItem('@Auth:user');
    localStorage.removeItem('@Auth:token');
    setUser(null);
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}