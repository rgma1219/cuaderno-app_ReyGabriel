/**
 * Representa la sesión del usuario autenticado en la aplicación.
 * Desacoplado del SDK directo de Firebase para cumplir con arquitectura limpia.
 */
export interface UserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Credenciales para el inicio de sesión con correo y contraseña.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Credenciales para el registro de un nuevo usuario.
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Estado global de autenticación gestionado por el AuthContext.
 */
export interface AuthState {
  user: UserSession | null;
  loading: boolean;
  error: string | null;
}
