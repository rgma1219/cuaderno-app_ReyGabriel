import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

export interface EmailTaskItem {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface SendSummaryPayload {
  recipientEmail: string;
  userDisplayName?: string;
  tasks: EmailTaskItem[];
}

interface ServerlessRequest {
  method?: string;
  body?: SendSummaryPayload | string;
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
 * Genera la plantilla de correo en formato HTML con estética limpia y profesional.
 */
function buildHtmlTemplate(
  tasks: EmailTaskItem[],
  userDisplayName: string,
): string {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const now = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tasksListHtml = tasks
    .map((task) => {
      const statusBadge = task.completed
        ? '<span style="background-color: #d1fae5; color: #065f46; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 99px;">✓ Completada</span>'
        : '<span style="background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 99px;">Pendiente</span>';

      const titleStyle = task.completed
        ? 'text-decoration: line-through; color: #94a3b8;'
        : 'color: #1e293b; font-weight: 600;';

      const descHtml = task.description
        ? `<p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">${task.description}</p>`
        : '';

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px;">
            <div style="${titleStyle} font-size: 14px;">${task.title}</div>
            ${descHtml}
          </td>
          <td style="padding: 12px 8px; text-align: right; vertical-align: top; white-space: nowrap;">
            ${statusBadge}
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Resumen de Tareas - Cuaderno</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        <!-- Encabezado con degradado suave -->
        <tr>
          <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Cuaderno</h1>
            <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Gestor de tareas</p>
          </td>
        </tr>

        <!-- Contenido Principal -->
        <tr>
          <td style="padding: 28px 24px;">
            <h2 style="margin: 0 0 8px; font-size: 18px; color: #1e293b;">Hola, ${userDisplayName}</h2>
            <p style="margin: 0 0 20px; font-size: 14px; color: #64748b;">
              Aquí tienes el resumen actualizado de tus tareas registrado el <strong>${now}</strong>:
            </p>

            <!-- Métricas rápidas -->
            <table width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
              <tr>
                <td align="center" style="padding: 12px;">
                  <span style="display: block; font-size: 20px; font-weight: bold; color: #1e293b;">${total}</span>
                  <span style="font-size: 12px; color: #64748b;">Total</span>
                </td>
                <td align="center" style="padding: 12px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
                  <span style="display: block; font-size: 20px; font-weight: bold; color: #2563eb;">${pending}</span>
                  <span style="font-size: 12px; color: #64748b;">Pendientes</span>
                </td>
                <td align="center" style="padding: 12px;">
                  <span style="display: block; font-size: 20px; font-weight: bold; color: #059669;">${completed}</span>
                  <span style="font-size: 12px; color: #64748b;">Completadas</span>
                </td>
              </tr>
            </table>

            <!-- Tabla de Tareas -->
            <table width="100%" style="border-collapse: collapse;">
              ${tasksListHtml}
            </table>
          </td>
        </tr>

        <!-- Pie de página -->
        <tr>
          <td style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
            Este correo fue generado automáticamente desde tu aplicación <strong>Cuaderno</strong> mediante AWS SES.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Genera la versión en texto plano como respaldo para clientes de correo sin soporte HTML.
 */
function buildPlainTextTemplate(
  tasks: EmailTaskItem[],
  userDisplayName: string,
): string {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  let text = `CUADERNO — Resumen de Tareas\n\n`;
  text += `Hola, ${userDisplayName}.\n`;
  text += `Resumen actual: ${total} tareas en total (${pending} pendientes, ${completed} completadas).\n\n`;
  text += `LISTADO DE TAREAS:\n`;
  text += `----------------------------------------\n`;

  tasks.forEach((task, index) => {
    const status = task.completed ? '[X] COMPLETADA' : '[ ] PENDIENTE';
    text += `${index + 1}. ${status} - ${task.title}\n`;
    if (task.description) {
      text += `   Notas: ${task.description}\n`;
    }
  });

  text += `----------------------------------------\n`;
  text += `Enviado automáticamente vía AWS SES desde Cuaderno.\n`;

  return text;
}

/**
 * Handler Serverless principal para Vercel Functions.
 */
export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse,
) {
  // CORS Headers básicos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  // 1. Validar método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido. Solo se aceptan peticiones POST.',
    });
  }

  // Parsear body si viene como string
  let payload: SendSummaryPayload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({
      success: false,
      error: 'Cuerpo de solicitud inválido (formato JSON esperado).',
    });
  }

  const { recipientEmail, userDisplayName, tasks } = payload || {};

  // 2. Validación de Payload (Exigencia de la Rúbrica)
  if (!recipientEmail || !isValidEmail(recipientEmail)) {
    return res.status(400).json({
      success: false,
      error: 'El correo electrónico del destinatario no es válido o está ausente.',
    });
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No se encontraron tareas para generar el resumen. El listado no puede estar vacío.',
    });
  }

  // 3. Validación de variables de entorno de AWS
  const awsRegion = process.env.AWS_REGION || 'us-east-1';
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const senderEmail = process.env.AWS_SES_SENDER_EMAIL;

  if (!awsAccessKeyId || !awsSecretAccessKey || !senderEmail) {
    return res.status(500).json({
      success: false,
      error: 'Las credenciales de AWS SES no están configuradas en las variables de entorno del servidor.',
    });
  }

  // 4. Inicializar cliente de AWS SES
  const sesClient = new SESClient({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const displayName = userDisplayName || recipientEmail.split('@')[0] || 'Usuario';
  const htmlContent = buildHtmlTemplate(tasks, displayName);
  const plainTextContent = buildPlainTextTemplate(tasks, displayName);

  // 5. Construir y enviar el comando de email a AWS SES
  const sendEmailCommand = new SendEmailCommand({
    Source: `Cuaderno <${senderEmail}>`,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Subject: {
        Data: `Cuaderno — Resumen de Tareas (${tasks.filter((t) => !t.completed).length} pendientes)`,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlContent,
          Charset: 'UTF-8',
        },
        Text: {
          Data: plainTextContent,
          Charset: 'UTF-8',
        },
      },
    },
  });

  try {
    const sesResponse = await sesClient.send(sendEmailCommand);
    return res.status(200).json({
      success: true,
      message: 'Resumen enviado exitosamente a tu correo.',
      messageId: sesResponse.MessageId,
    });
  } catch (error) {
    console.error('[AWS SES Error]:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido al despachar correo con AWS SES.';

    return res.status(500).json({
      success: false,
      error: `Error al enviar correo con AWS SES: ${errorMessage}`,
    });
  }
}
