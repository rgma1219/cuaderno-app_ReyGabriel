import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  UserSession,
  LoginCredentials,
  RegisterCredentials,
} from '../../types/auth.types';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle as loginWithGoogleService,
  logoutUser,
  subscribeToAuthChanges,
} from '../../services/auth.service';
import { requestEmailVerification } from '../../services/email.service';

/**
 * Contrato de los valores y funciones expuestos por el contexto de autenticación.
 */
export interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<UserSession>;
  register: (credentials: RegisterCredentials) => Promise<UserSession>;
  loginWithGoogle: () => Promise<UserSession>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Suscripción al observador de Firebase Auth para persistencia automática de sesión
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<UserSession> => {
    const loggedUser = await loginWithEmail(credentials);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (credentials: RegisterCredentials): Promise<UserSession> => {
    const registeredUser = await registerWithEmail(credentials);
    setUser(registeredUser);
    if (registeredUser.email) {
      requestEmailVerification(registeredUser.email).catch(() => {});
    }
    return registeredUser;
  };

  const loginWithGoogle = async (): Promise<UserSession> => {
    const googleUser = await loginWithGoogleService();
    setUser(googleUser);
    if (googleUser.email) {
      requestEmailVerification(googleUser.email).catch(() => {});
    }
    return googleUser;
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setUser(null);
  };

  // Memoización del valor del contexto para prevenir re-renders innecesarios en consumidores
  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
