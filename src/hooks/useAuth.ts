import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../features/auth/AuthContext';

/**
 * Custom Hook para acceder al estado y métodos de autenticación de forma segura y tipada.
 * Lanza un error descriptivo si se invoca fuera del árbol de AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }

  return context;
}
