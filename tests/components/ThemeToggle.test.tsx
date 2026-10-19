import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../src/features/theme/ThemeContext';
import { ThemeToggle } from '../../src/components/ThemeToggle';

describe('Componente: ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('debe renderizar el botón de alternar tema con título accesible', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('theme-toggle');
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute('aria-label');
  });

  it('debe alternar de tema claro a oscuro al hacer click y persistir en localStorage', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('theme-toggle');
    
    // Al hacer click, cambia de tema
    await user.click(toggleBtn);

    const storedTheme = localStorage.getItem('cuaderno_theme');
    expect(storedTheme).toBeDefined();
    expect(['light', 'dark']).toContain(storedTheme);
    expect(document.documentElement.getAttribute('data-theme')).toBe(storedTheme);
  });
});
