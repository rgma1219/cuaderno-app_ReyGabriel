import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export interface ProtectedRouteProps {
  children?: ReactNode;
}

/**
 * Guardián de navegación: Bloquea el acceso a rutas privadas a usuarios no autenticados.
 * Maneja el estado de carga para no redirigir prematuramente mientras Firebase verifica la sesión.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="auth-loading-card glass-panel">
          <div className="spinner-indicator" />
          <p className="auth-loading-text">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
