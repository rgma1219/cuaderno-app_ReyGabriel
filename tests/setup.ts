import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * Mock global de window.matchMedia para el entorno jsdom en pruebas.
 * jsdom no implementa CSS media queries por defecto.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // retrocompatibilidad
    removeListener: vi.fn(), // retrocompatibilidad
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * Limpieza automática del árbol de componentes de React Testing Library
 * después de cada prueba individual para evitar efectos secundarios.
 */
afterEach(() => {
  cleanup();
});

