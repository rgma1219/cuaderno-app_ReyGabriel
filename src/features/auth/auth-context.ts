import { createContext } from 'react';
import type { UserSession, LoginCredentials, RegisterCredentials } from '../../types/auth.types';

export interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<UserSession>;
  register: (credentials: RegisterCredentials) => Promise<UserSession>;
  loginWithGoogle: () => Promise<UserSession>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
