import { Router } from 'express';

export const docsRouter = Router();

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'A Crude Server',
    version: '0.1.0',
    description: 'API documentation for the Express TypeScript server.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Service health checks',
    },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check service health',
        responses: {
          '200': {
            description: 'Service and database are reachable',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthReport',
                },
              },
            },
          },
          '503': {
            description: 'Service is running but a dependency is unhealthy',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthReport',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthReport: {
        type: 'object',
        required: ['status', 'service', 'database', 'timestamp', 'uptime'],
        properties: {
          status: {
            type: 'string',
            enum: ['UP', 'DOWN'],
          },
          service: {
            type: 'string',
            example: 'crude-server',
          },
          database: {
            type: 'string',
            enum: ['connected', 'error'],
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
          uptime: {
            type: 'number',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        required: ['message'],
        properties: {
          message: {
            type: 'string',
          },
        },
      },
      ValidationError: {
        type: 'object',
        required: ['message', 'issues'],
        properties: {
          message: {
            type: 'string',
            example: 'Validation failed',
          },
          issues: {
            type: 'object',
          },
        },
      },
    },
  },
} as const;

export const docsHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>A Crude Server API Docs</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #1f2933;
        background: #f6f8fa;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
      }

      header {
        border-bottom: 1px solid #d9e2ec;
        background: #ffffff;
        padding: 32px max(24px, calc((100vw - 1040px) / 2));
      }

      main {
        max-width: 1040px;
        margin: 0 auto;
        padding: 28px 24px 48px;
      }

      h1 {
        margin: 0 0 8px;
        font-size: 32px;
        line-height: 1.15;
      }

      h2 {
        margin: 32px 0 12px;
        font-size: 22px;
      }

      h3 {
        margin: 0;
        font-size: 18px;
      }

      p {
        margin: 0;
        color: #52616b;
      }

      a {
        color: #0b63ce;
      }

      .endpoint {
        display: grid;
        gap: 12px;
        margin: 14px 0;
        padding: 18px;
        border: 1px solid #d9e2ec;
        border-radius: 8px;
        background: #ffffff;
      }

      .endpoint-title {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .method {
        min-width: 64px;
        border-radius: 999px;
        padding: 4px 10px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0;
        color: #ffffff;
        background: #136f63;
      }

      .method.post {
        background: #9f580a;
      }

      code {
        border-radius: 6px;
        background: #eef2f7;
        padding: 3px 6px;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 0.95em;
      }

      pre {
        overflow-x: auto;
        margin: 0;
        border-radius: 8px;
        background: #17202a;
        color: #f8fafc;
        padding: 14px;
      }

      pre code {
        background: transparent;
        color: inherit;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>A Crude Server API Docs</h1>
      <p>OpenAPI JSON is available at <a href="/docs/openapi.json">/docs/openapi.json</a>.</p>
    </header>
    <main>
      <h2>Health</h2>
      <section class="endpoint">
        <div class="endpoint-title">
          <span class="method">GET</span>
          <h3><code>/health</code></h3>
        </div>
        <p>Checks service and database health.</p>
      </section>
    </main>
  </body>
</html>`;

docsRouter.get('/', (_request, response) => {
  response.type('html').send(docsHtml);
});

docsRouter.get('/openapi.json', (_request, response) => {
  response.json(openApiDocument);
});
