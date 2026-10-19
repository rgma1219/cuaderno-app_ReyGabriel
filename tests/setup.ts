import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Limpieza automática del árbol de componentes de React Testing Library
 * después de cada prueba individual para evitar efectos secundarios.
 */
afterEach(() => {
  cleanup();
});
