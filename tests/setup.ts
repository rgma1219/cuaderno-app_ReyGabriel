import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Variables de entorno de respaldo para pruebas aisladas sin .env
if (!process.env.VITE_FIREBASE_API_KEY) {
  process.env.VITE_FIREBASE_API_KEY = 'AIzaSyDummyApiKeyForTestingPurposesOnly';
}
if (!process.env.VITE_FIREBASE_AUTH_DOMAIN) {
  process.env.VITE_FIREBASE_AUTH_DOMAIN = 'cuaderno-test.firebaseapp.com';
}
if (!process.env.VITE_FIREBASE_PROJECT_ID) {
  process.env.VITE_FIREBASE_PROJECT_ID = 'cuaderno-test';
}
if (!process.env.VITE_FIREBASE_STORAGE_BUCKET) {
  process.env.VITE_FIREBASE_STORAGE_BUCKET = 'cuaderno-test.appspot.com';
}
if (!process.env.VITE_FIREBASE_MESSAGING_SENDER_ID) {
  process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = '123456789012';
}
if (!process.env.VITE_FIREBASE_APP_ID) {
  process.env.VITE_FIREBASE_APP_ID = '1:123456789012:web:abcdef123456';
}

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


