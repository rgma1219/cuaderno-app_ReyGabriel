import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function localApiPlugin(): Plugin {
  return {
    name: 'local-serverless-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/send-summary' || url === '/api/verify-identity') {
          try {
            const modulePath = url === '/api/send-summary' ? '/api/send-summary.ts' : '/api/verify-identity.ts';
            const { default: handler } = await server.ssrLoadModule(modulePath);

            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });

            req.on('end', async () => {
              let parsedBody: unknown;
              try {
                parsedBody = bodyStr ? JSON.parse(bodyStr) : {};
              } catch {
                parsedBody = bodyStr;
              }

              let statusCode = 200;
              const mockReq = {
                method: req.method,
                headers: req.headers,
                body: parsedBody,
              };

              const mockRes = {
                status(code: number) {
                  statusCode = code;
                  return this;
                },
                setHeader(name: string, value: string) {
                  res.setHeader(name, value);
                  return this;
                },
                json(data: unknown) {
                  res.statusCode = statusCode;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                },
              };

              await handler(mockReq, mockRes);
            });
            return;
          } catch (err) {
            console.error('[Vite Local API Middleware Error]:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: String(err) }));
            return;
          }
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno del .env en process.env para los handlers serverless locales
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), localApiPlugin()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/setup.ts',
      css: true,
    },
  };
});
