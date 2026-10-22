import {
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  ThemeContext,
  type Theme,
  type ResolvedTheme,
} from './theme-context';

export type { Theme, ResolvedTheme };

const THEME_STORAGE_KEY = 'cuaderno_theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // Ignore localStorage access errors
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    const initialTheme = getStoredTheme();
    return initialTheme === 'system' ? getSystemTheme() : initialTheme;
  });

  // Efecto para sincronizar resolvedTheme y el atributo en el DOM
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;

    const updateResolvedTheme = () => {
      const currentResolved =
        theme === 'system'
          ? (mediaQuery?.matches ? 'dark' : 'light')
          : theme;

      setResolvedTheme(currentResolved);
      document.documentElement.setAttribute('data-theme', currentResolved);
      document.documentElement.style.colorScheme = currentResolved;
    };

    updateResolvedTheme();

    if (!mediaQuery || typeof mediaQuery.addEventListener !== 'function') return;

    const handleSystemChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignore localStorage access errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

