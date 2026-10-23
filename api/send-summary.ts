import {
  SESClient,
  SendEmailCommand,
  VerifyEmailIdentityCommand,
} from "@aws-sdk/client-ses";

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

export interface ServerlessRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: SendSummaryPayload | string;
}

export interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => ServerlessResponse;
}

/**
 * Escapa caracteres especiales de HTML para prevenir inyección de código y phishing.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Validador estricto de formato y longitud de correo electrónico (RFC 5322).
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Verifica el ID Token de Firebase usando la API REST oficial de Google Identity Toolkit.
 * No requiere la dependencia pesada firebase-admin ni claves de cuentas de servicio.
 */
export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<{ uid: string; email?: string } | null> {
  const apiKey =
    process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;

  if (!apiKey) {
    // Si no hay API key configurada en el entorno serverless, registrar advertencia
    console.warn(
      "[Auth Warning] Falta VITE_FIREBASE_API_KEY para validar el token.",
    );
    return null;
  }

  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    console.error("[Firebase Token Verification Error]:", err);
    return null;
  }
}

/**
 * Genera la plantilla de correo en formato HTML con estética limpia, profesional y sanitizada.
 */
export function buildHtmlTemplate(
  tasks: EmailTaskItem[],
  userDisplayName: string,
): string {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const safeName = escapeHtml(userDisplayName);
  const now = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tasksListHtml = tasks
    .map((task) => {
      const statusBadge = task.completed
        ? '<span style="background-color: #d1fae5; color: #065f46; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 99px;">✓ Completada</span>'
        : '<span style="background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 99px;">Pendiente</span>';

      const titleStyle = task.completed
        ? "text-decoration: line-through; color: #94a3b8;"
        : "color: #1e293b; font-weight: 600;";

      const safeTitle = escapeHtml(task.title);
      const safeDesc = task.description ? escapeHtml(task.description) : "";

      const descHtml = safeDesc
        ? `<p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">${safeDesc}</p>`
        : "";

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px;">
            <div style="${titleStyle} font-size: 14px;">${safeTitle}</div>
            ${descHtml}
          </td>
          <td style="padding: 12px 8px; text-align: right; vertical-align: top; white-space: nowrap;">
            ${statusBadge}
          </td>
        </tr>
      `;
    })
    .join("");

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
            <h2 style="margin: 0 0 8px; font-size: 18px; color: #1e293b;">Hola, ${safeName}</h2>
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
export function buildPlainTextTemplate(
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
    const status = task.completed ? "[X] COMPLETADA" : "[ ] PENDIENTE";
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
  // Manejo de preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  // 1. Validar método HTTP
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Método no permitido. Solo se aceptan peticiones POST.",
    });
  }

  // 2. Control de Acceso: Requerir y validar Token de Firebase
  const authHeader =
    (req.headers?.authorization as string | undefined) ||
    (req.headers?.Authorization as string | undefined);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Acceso no autorizado. Se requiere un token de sesión válido.",
    });
  }

  const idToken = authHeader.split("Bearer ")[1]?.trim();
  if (!idToken) {
    return res.status(401).json({
      success: false,
      error: "Token de autenticación ausente o malformado.",
    });
  }

  const verifiedUser = await verifyFirebaseIdToken(idToken);
  if (!verifiedUser) {
    return res.status(401).json({
      success: false,
      error: "Sesión no válida o expirada. Por favor vuelve a iniciar sesión.",
    });
  }

  // 3. Parsear y Validar Payload
  let payload: SendSummaryPayload;
  try {
    payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({
      success: false,
      error: "Cuerpo de solicitud inválido (formato JSON esperado).",
    });
  }

  const { recipientEmail, userDisplayName, tasks } = payload || {};

  // Forzar que el destinatario sea el email autenticado para evitar Open Relay
  const targetEmail = verifiedUser.email || recipientEmail;

  if (!targetEmail || !isValidEmail(targetEmail)) {
    return res.status(400).json({
      success: false,
      error:
        "El correo electrónico del destinatario no es válido o está ausente.",
    });
  }

  // Si el cliente envió un email diferente al del token verificado, rechazar
  if (
    verifiedUser.email &&
    recipientEmail &&
    recipientEmail.trim().toLowerCase() !==
      verifiedUser.email.trim().toLowerCase()
  ) {
    return res.status(403).json({
      success: false,
      error:
        "No está permitido enviar resúmenes a un correo distinto al de la cuenta autenticada.",
    });
  }

  // Validación estricta de userDisplayName (tipo y longitud)
  if (userDisplayName !== undefined && typeof userDisplayName !== "string") {
    return res.status(400).json({
      success: false,
      error: "El nombre del usuario debe ser una cadena de texto válida.",
    });
  }
  if (typeof userDisplayName === "string" && userDisplayName.length > 100) {
    return res.status(400).json({
      success: false,
      error:
        "El nombre de usuario excede la longitud máxima permitida (100 caracteres).",
    });
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({
      success: false,
      error:
        "No se encontraron tareas para generar el resumen. El listado no puede estar vacío.",
    });
  }

  // Control de abuso: límite de cantidad de tareas
  if (tasks.length > 100) {
    return res.status(400).json({
      success: false,
      error:
        "El número de tareas excede el límite permitido por resumen (máximo 100 tareas).",
    });
  }

  // Validación exhaustiva de cada tarea procesada
  for (const t of tasks) {
    if (!t || typeof t !== "object" || Array.isArray(t)) {
      return res.status(400).json({
        success: false,
        error:
          "Cada elemento del listado de tareas debe ser un objeto válido.",
      });
    }
    if (typeof t.title !== "string" || t.title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Todas las tareas deben tener un título válido.",
      });
    }
    if (t.title.length > 200) {
      return res.status(400).json({
        success: false,
        error: "El título de la tarea supera el límite permitido de 200 caracteres.",
      });
    }
    if (typeof t.completed !== "boolean") {
      return res.status(400).json({
        success: false,
        error:
          "El estado de completitud de cada tarea debe ser un valor booleano estricto.",
      });
    }
    if (t.description !== undefined && typeof t.description !== "string") {
      return res.status(400).json({
        success: false,
        error: "La descripción de la tarea debe ser una cadena de texto.",
      });
    }
    if (t.description && t.description.length > 1000) {
      return res.status(400).json({
        success: false,
        error:
          "La descripción de la tarea supera el límite permitido de 1000 caracteres.",
      });
    }
  }

  // 4. Validación de variables de entorno de AWS SES
  const awsRegion =
    process.env.AWS_SES_REGION ||
    (process.env.AWS_REGION && process.env.AWS_REGION !== "us-east-1"
      ? process.env.AWS_REGION
      : "us-east-2");
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const senderEmail = process.env.AWS_SES_SENDER_EMAIL;

  if (!awsAccessKeyId || !awsSecretAccessKey || !senderEmail) {
    return res.status(500).json({
      success: false,
      error:
        "Las credenciales de AWS SES no están configuradas en las variables de entorno del servidor.",
    });
  }

  // 5. Inicializar cliente de AWS SES
  const sesClient = new SESClient({
    region: awsRegion,
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  const displayName = userDisplayName || targetEmail.split("@")[0] || "Usuario";
  const htmlContent = buildHtmlTemplate(tasks, displayName);
  const plainTextContent = buildPlainTextTemplate(tasks, displayName);

  // 6. Construir y enviar el comando de email a AWS SES
  const sendEmailCommand = new SendEmailCommand({
    Source: `Cuaderno <${senderEmail}>`,
    Destination: {
      ToAddresses: [targetEmail],
    },
    Message: {
      Subject: {
        Data: `Cuaderno — Resumen de Tareas (${tasks.filter((t) => !t.completed).length} pendientes)`,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: htmlContent,
          Charset: "UTF-8",
        },
        Text: {
          Data: plainTextContent,
          Charset: "UTF-8",
        },
      },
    },
  });

  try {
    const sesResponse = await sesClient.send(sendEmailCommand);
    return res.status(200).json({
      success: true,
      message: "Resumen enviado exitosamente a tu correo.",
      messageId: sesResponse.MessageId,
    });
  } catch (error: unknown) {
    console.error("[AWS SES Error]:", error);
    const err = error as { name?: string; message?: string };
    const isUnverified =
      err?.name === "MessageRejected" ||
      err?.message?.includes("Email address is not verified") ||
      err?.message?.includes("identities failed the check");

    if (isUnverified) {
      try {
        await sesClient.send(
          new VerifyEmailIdentityCommand({
            EmailAddress: targetEmail.trim().toLowerCase(),
          }),
        );
      } catch (verifyErr) {
        console.warn("[AWS SES Auto-Verify Warning]:", verifyErr);
      }

      return res.status(400).json({
        success: false,
        error:
          'Tu correo aún no ha sido confirmado. Te enviamos un enlace de validación a tu bandeja de entrada (o Spam): por favor confírmalo y luego vuelve a presionar "Enviar resumen".',
      });
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al despachar el correo.";

    return res.status(500).json({
      success: false,
      error: `Error al enviar correo: ${errorMessage}`,
    });
  }
}
