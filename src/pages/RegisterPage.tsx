import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from '../components/BrandLogo';

export function RegisterPage() {
  const { register, loginWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si ya hay un usuario autenticado y no está cargando, redirigir a /tasks
  if (!authLoading && user) {
    return <Navigate to="/tasks" replace />;
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validación de coincidencia de contraseñas en cliente
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor, verifícalas.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ email, password });
      navigate('/tasks');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error inesperado al registrar la cuenta.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
      navigate('/tasks');
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ocurrió un error al registrarse con Google.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-panel">
        <header className="auth-header">
          <BrandLogo size="lg" />
          <p className="auth-subtitle">Crea tu cuenta para comenzar a organizar tus tareas</p>
        </header>

        {errorMessage && (
          <div className="glass-alert glass-alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <span className="alert-text">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="register-email" className="form-label">
              Correo Electrónico
            </label>
            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              className="glass-input"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password" className="form-label">
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              required
              autoComplete="new-password"
              className="glass-input"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password" className="form-label">
              Confirmar Contraseña
            </label>
            <input
              id="register-confirm-password"
              type="password"
              required
              autoComplete="new-password"
              className="glass-input"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="glass-button glass-button-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-separator">
          <span className="separator-line" />
          <span className="separator-text">o</span>
          <span className="separator-line" />
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="glass-button glass-button-secondary w-full google-btn"
          disabled={isSubmitting}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Registrarse con Google
        </button>

        <footer className="auth-footer">
          <p className="auth-footer-text">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="auth-link">
              Inicia sesión aquí
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
