import { useContext } from 'react';
import {
  ThemeContext,
  type Theme,
  type ResolvedTheme,
  type ThemeContextType,
} from '../features/theme/theme-context';

export type { Theme, ResolvedTheme, ThemeContextType };

/**
 * Custom Hook para consumir el contexto de tema
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser utilizado dentro de un ThemeProvider');
  }
  return context;
}

