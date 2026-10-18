import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TasksPage } from '../pages/TasksPage';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * Enrutador principal de la aplicación.
 * Define las rutas públicas (/login, /register), la ruta privada (/tasks) protegida
 * por ProtectedRoute, y la redirección por defecto.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas de Autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Ruta Privada Protegida */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
