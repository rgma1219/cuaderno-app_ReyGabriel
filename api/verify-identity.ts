import { SESClient, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';

export interface VerifyIdentityPayload {
  email: string;
}

export interface ServerlessRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: VerifyIdentityPayload | string;
}

export interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => ServerlessResponse;
}

/**
 * Validador básico de formato de correo electrónico.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Verifica el ID Token de Firebase usando la API REST oficial de Google Identity Toolkit.
 */
export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<{ uid: string; email?: string } | null> {
  const apiKey =
    process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      users?: Array<{ localId: string; email?: string }>;
    };

    const user = data.users?.[0];
    if (!user) return null;

    return {
      uid: user.localId,
      email: user.email,
    };
  } catch (err) {
    console.error('[Firebase Token Verification Error]:', err);
    return null;
  }
}

/**
 * Endpoint Serverless para registrar una dirección de correo en AWS SES
 * y disparar el envío del correo de verificación (requerido para entornos Sandbox).
 * Protegido para garantizar que solo usuarios autenticados puedan solicitarlo para su propia cuenta.
 */
export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse,
) {
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido. Solo se aceptan peticiones POST.',
    });
  }

  // 1. Control de Acceso: Requerir y validar Token de Firebase
  const authHeader =
    (req.headers?.authorization as string | undefined) ||
    (req.headers?.Authorization as string | undefined);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Acceso no autorizado. Se requiere un token de sesión válido.',
    });
  }

  const idToken = authHeader.split('Bearer ')[1]?.trim();
  if (!idToken) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticación ausente o malformado.',
    });
  }

  const verifiedUser = await verifyFirebaseIdToken(idToken);
  if (!verifiedUser) {
    return res.status(401).json({
      success: false,
      error: 'Sesión no válida o expirada. Por favor vuelve a iniciar sesión.',
    });
  }

  // 2. Parsear y Validar Payload
  let payload: VerifyIdentityPayload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({
      success: false,
      error: 'Cuerpo de solicitud inválido (formato JSON esperado).',
    });
  }

  const { email } = payload || {};
  const targetEmail = verifiedUser.email || email;

  if (!targetEmail || !isValidEmail(targetEmail)) {
    return res.status(400).json({
      success: false,
      error: 'El correo electrónico proporcionado no es válido o está ausente.',
    });
  }

  // Si el usuario intenta verificar un email ajeno a su cuenta, rechazar
  if (
    verifiedUser.email &&
    email &&
    email.trim().toLowerCase() !== verifiedUser.email.trim().toLowerCase()
  ) {
    return res.status(403).json({
      success: false,
      error: 'Solo puedes solicitar verificación para el correo de tu propia cuenta.',
    });
  }

  // 3. Configuración de credenciales y región
  const awsRegion =
    process.env.AWS_SES_REGION ||
    (process.env.AWS_REGION && process.env.AWS_REGION !== 'us-east-1'
      ? process.env.AWS_REGION
      : 'us-east-2');
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!awsAccessKeyId || !awsSecretAccessKey) {
    return res.status(500).json({
      success: false,
      error: 'Las credenciales de AWS SES no están configuradas en el servidor.',
    });
  }

  const sesClient = new SESClient({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  try {
    const command = new VerifyEmailIdentityCommand({
      EmailAddress: targetEmail.trim().toLowerCase(),
    });
    await sesClient.send(command);

    return res.status(200).json({
      success: true,
      message: 'Solicitud de verificación enviada con éxito. Revisa tu bandeja de entrada o spam.',
    });
  } catch (error) {
    console.error('[AWS SES Verify Identity Error]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error al registrar la validación del correo.';

    return res.status(500).json({
      success: false,
      error: `Error al procesar la verificación del correo: ${errorMessage}`,
    });
  }
}

