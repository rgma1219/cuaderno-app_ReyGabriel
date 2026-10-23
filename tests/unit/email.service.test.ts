import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendTaskSummaryEmail, requestEmailVerification } from '../../src/services/email.service';
import type { Task } from '../../src/types/task.types';

const mockTasks: Task[] = [
  {
    id: 't-1',
    userId: 'u-1',
    title: 'Tarea de prueba',
    description: 'Notas',
    completed: false,
    createdAt: 1000,
    updatedAt: 1000,
  },
];

describe('Servicio de Email: sendTaskSummaryEmail (Casos Borde y Serverless)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('debe enviar la petición correctamente y resolver con éxito cuando la función serverless responde 200', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: 'Resumen enviado exitosamente a tu correo.',
        messageId: 'ses-msg-12345',
      }),
    });

    vi.stubGlobal('fetch', mockFetch);

    const result = await sendTaskSummaryEmail({
      recipientEmail: 'test@example.com',
      userDisplayName: 'Usuario Test',
      tasks: mockTasks,
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/send-summary',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(result.success).toBe(true);
    expect(result.messageId).toBe('ses-msg-12345');
  });

  it('caso borde: debe capturar y arrojar el error descriptivo si el serverless responde 500 con fallo de AWS SES', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        success: false,
        error: 'Las credenciales de AWS SES no son válidas o están expiradas.',
      }),
    });

    vi.stubGlobal('fetch', mockFetch);

    await expect(
      sendTaskSummaryEmail({
        recipientEmail: 'test@example.com',
        userDisplayName: 'Usuario Test',
        tasks: mockTasks,
      }),
    ).rejects.toThrow('Las credenciales de AWS SES no son válidas o están expiradas.');
  });

  it('caso borde: debe manejar respuestas no-JSON o fallas de red del servidor con un error legible', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('Bad Gateway');
      },
    });

    vi.stubGlobal('fetch', mockFetch);

    await expect(
      sendTaskSummaryEmail({
        recipientEmail: 'test@example.com',
        userDisplayName: 'Usuario Test',
        tasks: mockTasks,
      }),
    ).rejects.toThrow('Error del servidor al despachar el correo (Código HTTP 502).');
  });

  describe('Verificación de Identidad: requestEmailVerification', () => {
    it('debe despachar la petición a /api/verify-identity con el correo formateado y retornar true en caso exitoso', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      vi.stubGlobal('fetch', mockFetch);

      const result = await requestEmailVerification('User@Example.COM');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/verify-identity',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'user@example.com' }),
        }),
      );
      expect(result).toBe(true);
    });

    it('debe retornar false directamente si el email es inválido sin invocar fetch', async () => {
      const mockFetch = vi.fn();
      vi.stubGlobal('fetch', mockFetch);

      const result = await requestEmailVerification('');
      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('debe capturar errores de red sin propagar excepción y retornar false', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network Failure'));
      vi.stubGlobal('fetch', mockFetch);

      const result = await requestEmailVerification('test@example.com');
      expect(result).toBe(false);
    });
  });
});
