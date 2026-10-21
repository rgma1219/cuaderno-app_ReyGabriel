import { SESClient, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';

interface VerifyIdentityPayload {
  email: string;
}

interface ServerlessRequest {
  method?: string;
  body?: VerifyIdentityPayload | string;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => ServerlessResponse;
}

/**
 * Validador básico de formato de correo electrónico.
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Endpoint Serverless para registrar automáticamente una dirección de correo en AWS SES
 * y disparar el envío del correo de verificación (requerido para entornos Sandbox).
 */
export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse,
) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido. Solo se aceptan peticiones POST.',
    });
  }

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

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'El correo electrónico proporcionado no es válido o está ausente.',
    });
  }

  // Configuración de credenciales y región
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
    const command = new VerifyEmailIdentityCommand({ EmailAddress: email.trim().toLowerCase() });
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
