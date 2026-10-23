import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler, {
  escapeHtml,
  isValidEmail,
  buildPlainTextTemplate,
  buildHtmlTemplate,
  type ServerlessRequest,
  type ServerlessResponse,
} from '../../api/send-summary';

// Mock de AWS SES
vi.mock('@aws-sdk/client-ses', () => {
  return {
    SESClient: class MockSESClient {
      send = vi.fn().mockResolvedValue({ MessageId: 'ses_msg_12345' });
    },
    SendEmailCommand: class MockSendEmailCommand {
      params: unknown;
      constructor(params: unknown) {
        this.params = params;
      }
    },
    VerifyEmailIdentityCommand: class MockVerifyEmailIdentityCommand {
      params: unknown;
      constructor(params: unknown) {
        this.params = params;
      }
    },
  };
});

describe('Backend Serverless: /api/send-summary (Funciones y Handler)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWS_SES_REGION = 'us-east-2';
    process.env.AWS_ACCESS_KEY_ID = 'test_key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test_secret';
    process.env.AWS_SES_SENDER_EMAIL = 'remitente@cuaderno.app';
  });

  describe('Sanitización HTML (escapeHtml)', () => {
    it('debe escapar correctamente caracteres peligrosos de inyección HTML', () => {
      const dangerousInput = '<script>alert("XSS & Phishing")</script>\'test\'';
      const escaped = escapeHtml(dangerousInput);

      expect(escaped).toBe(
        '&lt;script&gt;alert(&quot;XSS &amp; Phishing&quot;)&lt;/script&gt;&#39;test&#39;',
      );
      expect(escaped).not.toContain('<script>');
    });

    it('debe escapar textos dentro de las plantillas HTML generadas', () => {
      const maliciousTasks = [
        {
          title: '<b>Título Inyectado</b>',
          description: '<a href="http://evil.com">Click aquí</a>',
          completed: false,
        },
      ];
      const html = buildHtmlTemplate(maliciousTasks, '<MaliciousUser>');

      expect(html).toContain('&lt;b&gt;Título Inyectado&lt;/b&gt;');
      expect(html).toContain('&lt;a href=&quot;http://evil.com&quot;&gt;');
      expect(html).toContain('&lt;MaliciousUser&gt;');
      expect(html).not.toContain('<b>Título Inyectado</b>');
    });
  });

  describe('Validador de Correo (isValidEmail)', () => {
    it('debe retornar true para correos válidos y false para correos malformados', () => {
      expect(isValidEmail('usuario@dominio.com')).toBe(true);
      expect(isValidEmail('usuario.nombre@sub.dominio.org')).toBe(true);
      expect(isValidEmail('invalido-sin-arroba')).toBe(false);
      expect(isValidEmail('@dominio.com')).toBe(false);
      expect(isValidEmail('usuario@')).toBe(false);
      expect(isValidEmail('usuario@dominio-sin-tld')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('a'.repeat(250) + '@dominio.com')).toBe(false);
    });
  });

  describe('Plantilla de Texto Plano (buildPlainTextTemplate)', () => {
    it('debe incluir contador de pendientes y estado de tareas', () => {
      const tasks = [
        { title: 'Tarea 1', description: 'Nota', completed: false },
        { title: 'Tarea 2', description: '', completed: true },
      ];
      const text = buildPlainTextTemplate(tasks, 'Gabriel');

      expect(text).toContain('Hola, Gabriel.');
      expect(text).toContain('1 pendientes, 1 completadas');
      expect(text).toContain('[ ] PENDIENTE - Tarea 1');
      expect(text).toContain('[X] COMPLETADA - Tarea 2');
    });
  });

  describe('Handler Serverless (handler)', () => {
    function createMockResponse() {
      const res: ServerlessResponse & { statusCode: number; responseData: unknown } = {
        statusCode: 200,
        responseData: null,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(data: unknown) {
          this.responseData = data;
        },
        setHeader() {
          return this;
        },
      };
      return res;
    }

    it('debe responder 405 si el método no es POST', async () => {
      const req: ServerlessRequest = { method: 'GET' };
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(405);
      expect(res.responseData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('Solo se aceptan peticiones POST'),
        }),
      );
    });

    it('debe responder 401 si no se incluye encabezado Authorization Bearer', async () => {
      const req: ServerlessRequest = {
        method: 'POST',
        headers: {},
        body: {
          recipientEmail: 'user@example.com',
          tasks: [{ title: 'T1', completed: false }],
        },
      };
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      expect(res.responseData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('Acceso no autorizado'),
        }),
      );
    });

    it('debe responder 400 si el array de tareas está vacío', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [{ localId: 'user_123', email: 'user@example.com' }],
        }),
      } as Response);

      const req: ServerlessRequest = {
        method: 'POST',
        headers: { authorization: 'Bearer valid_token_123' },
        body: {
          recipientEmail: 'user@example.com',
          tasks: [],
        },
      };
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.responseData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('El listado no puede estar vacío'),
        }),
      );
    });

    it('debe responder 403 si el email solicitado difiere del usuario autenticado', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [{ localId: 'user_123', email: 'propietario@example.com' }],
        }),
      } as Response);

      const req: ServerlessRequest = {
        method: 'POST',
        headers: { authorization: 'Bearer valid_token_123' },
        body: {
          recipientEmail: 'victima@otrodominio.com',
          tasks: [{ title: 'Tarea', completed: false }],
        },
      };
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.responseData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('distinto al de la cuenta autenticada'),
        }),
      );
    });

    it('debe responder 400 si userDisplayName excede los 100 caracteres', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [{ localId: 'user_123', email: 'propietario@example.com' }],
        }),
      } as Response);

      const req: ServerlessRequest = {
        method: 'POST',
        headers: { authorization: 'Bearer valid_token_123' },
        body: {
          recipientEmail: 'propietario@example.com',
          userDisplayName: 'A'.repeat(101),
          tasks: [{ title: 'Tarea', completed: false }],
        },
      };
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.responseData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('longitud máxima permitida (100 caracteres)'),
        }),
      );
    });

    it('debe responder 400 si el campo completed de una tarea no es booleano estricto', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [{ localId: 'user_123', email: 'propietario@example.com' }],
        }),
      } as Response);

      const req: ServerlessRequest = {
        method: 'POST',
        headers: { authorization: 'Bearer valid_token_123' },
        body: {
          recipientEmail: 'propietario@example.com',
          tasks: [
            { title: 'Tarea con completed inválido', completed: 'true' as unknown as boolean },
          ],
        },
      };
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.responseData).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('debe ser un valor booleano estricto'),
        }),
      );
    });

    it('debe despachar el correo y responder 200 en flujo autorizado válido', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [{ localId: 'user_123', email: 'propietario@example.com' }],
        }),
      } as Response);

      const req: ServerlessRequest = {
        method: 'POST',
        headers: { authorization: 'Bearer valid_token_123' },
        body: {
          recipientEmail: 'propietario@example.com',
          userDisplayName: 'Propietario',
          tasks: [
            { id: '1', title: 'Tarea A', description: 'Nota A', completed: false },
            { id: '2', title: 'Tarea B', description: '', completed: true },
          ],
        },
      };
      const res = createMockResponse();

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.responseData).toEqual(
        expect.objectContaining({
          success: true,
          message: 'Resumen enviado exitosamente a tu correo.',
          messageId: 'ses_msg_12345',
        }),
      );
    });
  });
});
