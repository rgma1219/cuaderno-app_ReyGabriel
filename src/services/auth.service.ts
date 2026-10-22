import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, googleProvider } from './firebase';
import type {
  UserSession,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types';

/**
 * Convierte el usuario interno de Firebase en el modelo desacoplado de la aplicación.
 */
export function formatUserSession(user: FirebaseUser): UserSession {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

/**
 * Diccionario de mapeo de errores de Firebase Auth a mensajes amigables en español.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'El formato del correo electrónico no es válido.',
  'auth/user-disabled': 'Esta cuenta de usuario ha sido inhabilitada.',
  'auth/user-not-found': 'No existe ninguna cuenta con este correo electrónico.',
  'auth/wrong-password': 'La contraseña ingresada es incorrecta.',
  'auth/invalid-credential': 'Credenciales incorrectas. Verifica tu correo y contraseña.',
  'auth/email-already-in-use': 'Ya existe una cuenta registrada con este correo electrónico.',
  'auth/weak-password': 'La contraseña es muy débil. Debe tener al menos 6 caracteres.',
  'auth/popup-closed-by-user': 'El inicio de sesión con Google fue cancelado antes de completarse.',
  'auth/popup-blocked': 'La ventana emergente de inicio de sesión fue bloqueada por el navegador.',
  'auth/network-request-failed': 'Error de red. Verifica tu conexión a internet.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Por favor, intenta más tarde.',
};

/**
 * Traduce cualquier error capturado al mensaje en español correspondiente.
 */
export function mapFirebaseAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? 'Ocurrió un error en la autenticación. Intenta nuevamente.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado al procesar la solicitud.';
}

/**
 * Registra un nuevo usuario con correo electrónico y contraseña.
 */
export async function registerWithEmail(
  credentials: RegisterCredentials,
): Promise<UserSession> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email.trim(),
      credentials.password,
    );
    return formatUserSession(userCredential.user);
  } catch (error) {
    throw new Error(mapFirebaseAuthError(error), { cause: error });
  }
}

/**
 * Inicia sesión con correo electrónico y contraseña existentes.
 */
export async function loginWithEmail(
  credentials: LoginCredentials,
): Promise<UserSession> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email.trim(),
      credentials.password,
    );
    return formatUserSession(userCredential.user);
  } catch (error) {
    throw new Error(mapFirebaseAuthError(error), { cause: error });
  }
}

/**
 * Inicia sesión o registra al usuario mediante el proveedor de Google (Popup).
 */
export async function loginWithGoogle(): Promise<UserSession> {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return formatUserSession(userCredential.user);
  } catch (error) {
    throw new Error(mapFirebaseAuthError(error), { cause: error });
  }
}

/**
 * Cierra la sesión activa del usuario.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(mapFirebaseAuthError(error), { cause: error });
  }
}

/**
 * Suscribe un observador a los cambios de estado de autenticación (sesión persistente).
 * Devuelve la función de cancelación de suscripción para cleanup en useEffect.
 */
export function subscribeToAuthChanges(
  callback: (user: UserSession | null) => void,
): Unsubscribe {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(formatUserSession(firebaseUser));
    } else {
      callback(null);
    }
  });
}
