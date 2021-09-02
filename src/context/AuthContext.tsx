import React, { createContext, useState, useCallback } from 'react';
import api from '../services/api';

// funciona como um dto
interface SignInCredentials {
  email: string;
  password: string;
}
export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  avatar_url: string;
  email: string;
  token: string;
}

interface AuthState {
  token: string;
  user: User;
}

// formato dos dados do objeto de contexto de autenticacao
interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(updateUserData: User): void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData, // passando um obj daquele tipo
);

const AuthProvider: React.FC = ({ children }) => {
  // para caso o usuario ja tenha efetuado o login uma primeira vez
  const [authData, setAuthData] = useState<AuthState>(() => {
    // usando uma funcao para preencher o estado inicial da app
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return {
        token,
        user: JSON.parse(user),
      };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', { email, password });

    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    // toda req vai ter o token automaticament
    api.defaults.headers.authorization = `Bearer ${token}`;

    setAuthData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    // removendo os dados do contexto de authenticacao
    setAuthData({} as AuthState);
  }, []);

  // atualiza os dados do usuario apos a troca do avatar
  // so atualiza apos o request
  const updateUser = useCallback((updateUserData: User) => {
    localStorage.setItem('@GoBarber:user', JSON.stringify(updateUserData));
    setAuthData({
      token: updateUserData.token,
      user: updateUserData,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ signIn, user: authData.user, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
