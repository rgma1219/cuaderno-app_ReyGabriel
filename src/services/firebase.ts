import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Configuración de Firebase obtenida de las variables de entorno de Vite.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Validación temprana de configuración para desarrollo seguro.
 */
const requiredKeys: Array<keyof typeof firebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
];

const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

if (missingKeys.length > 0 && import.meta.env.DEV) {
  console.warn(
    `[Firebase Setup] Faltan variables de entorno en el archivo .env: ${missingKeys.join(', ')}. Verifica tu configuración.`,
  );
}

/**
 * Patrón Singleton para evitar inicializaciones duplicadas en HMR de Vite.
 */
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Instancia del servicio de Autenticación.
 */
export const auth: Auth = getAuth(app);

/**
 * Proveedor de autenticación con Google preconfigurado.
 */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Instancia del servicio de base de datos Cloud Firestore.
 */
export const db: Firestore = getFirestore(app);
