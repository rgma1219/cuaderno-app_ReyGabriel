import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../src/routes/ProtectedRoute';
import * as useAuthModule from '../../src/hooks/useAuth';

vi.mock('../../src/hooks/useAuth');

describe('Componente: ProtectedRoute', () => {
  it('debe mostrar el estado de carga mientras se verifica la sesión del usuario', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      loading: true,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <ProtectedRoute>
          <div>Contenido Privado</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Verificando sesión...')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Privado')).not.toBeInTheDocument();
  });

  it('debe redirigir a /login cuando no existe usuario autenticado', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <Routes>
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <div>Contenido Privado</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Privado')).not.toBeInTheDocument();
  });

  it('debe renderizar el contenido protegido cuando el usuario está autenticado', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: {
        uid: 'user_123',
        email: 'test@example.com',
        displayName: 'Usuario Demo',
        photoURL: null,
      },
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <ProtectedRoute>
          <div>Contenido Privado y Seguro</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Contenido Privado y Seguro')).toBeInTheDocument();
  });
});
