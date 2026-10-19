import { useTheme } from '../hooks/useTheme';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Componente ThemeToggle:
 * Botón interactivo accesible para alternar entre tema Claro y Oscuro.
 * Cuenta con micro-animaciones suaves y soporte Glassmorphism.
 */
export function ThemeToggle({
  className = '',
  showLabel = false,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const labelText = isDark ? 'Modo claro' : 'Modo oscuro';
  const actionTitle = isDark
    ? 'Cambiar a tema claro'
    : 'Cambiar a tema oscuro';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`glass-button glass-button-secondary theme-toggle-btn ${className}`.trim()}
      aria-label={actionTitle}
      title={actionTitle}
      data-testid="theme-toggle"
    >
      <span className="theme-toggle-icon-wrap" aria-hidden="true">
        {isDark ? (
          /* Ícono de Sol para cambiar a claro */
          <svg
            className="theme-icon sun-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          /* Ícono de Luna para cambiar a oscuro */
          <svg
            className="theme-icon moon-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </span>

      {showLabel && (
        <span className="theme-toggle-label">{labelText}</span>
      )}
    </button>
  );
}
