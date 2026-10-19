import type { Task } from '../types/task.types';

export interface SendSummaryRequestParams {
  recipientEmail: string;
  userDisplayName?: string;
  tasks: Task[];
}

export interface SendSummaryResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}

/**
 * Invoca el endpoint Serverless de Vercel (/api/send-summary) para despachar
 * el resumen de tareas mediante AWS SES de forma segura.
 */
export async function sendTaskSummaryEmail(
  params: SendSummaryRequestParams,
): Promise<SendSummaryResponse> {
  const payload = {
    recipientEmail: params.recipientEmail.trim(),
    userDisplayName: params.userDisplayName?.trim(),
    tasks: params.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
    })),
  };

  const response = await fetch('/api/send-summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    const errorMsg =
      data?.error ||
      `Error del servidor al despachar el correo (Código HTTP ${response.status}).`;
    throw new Error(errorMsg);
  }

  return data as SendSummaryResponse;
}
