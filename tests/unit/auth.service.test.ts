import { describe, it, expect } from 'vitest';
import { FirebaseError } from 'firebase/app';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  mapFirebaseAuthError,
  formatUserSession,
} from '../../src/services/auth.service';

describe('Servicio de Autenticación: mapFirebaseAuthError', () => {
  it('debe mapear auth/user-not-found a un mensaje claro en español', () => {
    const error = new FirebaseError('auth/user-not-found', 'User not found');
    const result = mapFirebaseAuthError(error);
    expect(result).toBe('No existe ninguna cuenta con este correo electrónico.');
  });

  it('debe mapear auth/wrong-password a un mensaje claro en español', () => {
    const error = new FirebaseError('auth/wrong-password', 'Wrong password');
    const result = mapFirebaseAuthError(error);
    expect(result).toBe('La contraseña ingresada es incorrecta.');
  });

  it('debe mapear auth/invalid-credential a credenciales incorrectas', () => {
    const error = new FirebaseError('auth/invalid-credential', 'Invalid credential');
    const result = mapFirebaseAuthError(error);
    expect(result).toBe('Credenciales incorrectas. Verifica tu correo y contraseña.');
  });

  it('debe mapear auth/email-already-in-use a mensaje de cuenta existente', () => {
    const error = new FirebaseError('auth/email-already-in-use', 'Email in use');
    const result = mapFirebaseAuthError(error);
    expect(result).toBe('Ya existe una cuenta registrada con este correo electrónico.');
  });

  it('debe mapear auth/weak-password a advertencia de contraseña corta', () => {
    const error = new FirebaseError('auth/weak-password', 'Weak password');
    const result = mapFirebaseAuthError(error);
    expect(result).toBe('La contraseña es muy débil. Debe tener al menos 6 caracteres.');
  });

  it('debe mapear auth/popup-closed-by-user a cancelación amigable de Google', () => {
    const error = new FirebaseError('auth/popup-closed-by-user', 'Popup closed');
    const result = mapFirebaseAuthError(error);
    expect(result).toBe('El inicio de sesión con Google fue cancelado antes de completarse.');
  });

  it('debe manejar códigos desconocidos de Firebase con un mensaje de respaldo amigable', () => {
    const error = new FirebaseError('auth/unknown-code', 'Unknown code');
    const result = mapFirebaseAuthError(error);
    expect(result).toBe('Ocurrió un error en la autenticación. Intenta nuevamente.');
  });

  it('debe devolver el mensaje nativo si se pasa una instancia de Error común', () => {
    const error = new Error('Error personalizado');
    const result = mapFirebaseAuthError(error);
    expect(result).toBe('Error personalizado');
  });

  it('debe manejar valores no-Error (unknown) con un mensaje genérico', () => {
    const result = mapFirebaseAuthError('un string cualquiera');
    expect(result).toBe('Ocurrió un error inesperado al procesar la solicitud.');
  });
});

describe('Servicio de Autenticación: formatUserSession', () => {
  it('debe desacoplar el objeto FirebaseUser y extraer únicamente los datos de sesión', () => {
    const mockFirebaseUser = {
      uid: 'user_12345',
      email: 'test@example.com',
      displayName: 'Usuario Demo',
      photoURL: 'https://example.com/avatar.png',
      // Propiedades internas de Firebase que deben quedar fuera
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: 'tok_xxx',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'token',
      getIdTokenResult: async () =>
        ({} as unknown as import('firebase/auth').IdTokenResult),
      reload: async () => {},
      toJSON: () => ({}),
      phoneNumber: null,
      providerId: 'firebase',
    } as unknown as FirebaseUser;

    const userSession = formatUserSession(mockFirebaseUser);

    expect(userSession).toEqual({
      uid: 'user_12345',
      email: 'test@example.com',
      displayName: 'Usuario Demo',
      photoURL: 'https://example.com/avatar.png',
    });
  });
});
