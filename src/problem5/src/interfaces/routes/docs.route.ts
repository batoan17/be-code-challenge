import { Router } from 'express';

export const docsRouter = Router();

const userResponse = {
  type: 'object',
  required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
  properties: {
    id: {
      type: 'string',
      example: '6560f7f60d3f5b8f3d5c5d11',
    },
    name: {
      type: 'string',
      example: 'Ada Lovelace',
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'ada@example.com',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
} as const;

const userWriteBody = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      example: 'Ada Lovelace',
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 254,
      example: 'ada@example.com',
    },
  },
} as const;

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
    {
      name: 'Users',
      description: 'User resource CRUD operations',
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
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        parameters: [
          {
            in: 'query',
            name: 'name',
            schema: { type: 'string' },
            required: false,
          },
          {
            in: 'query',
            name: 'email',
            schema: { type: 'string' },
            required: false,
          },
        ],
        responses: {
          '200': {
            description: 'Users matching the provided filters',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserListResponse',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUserRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
          '409': {
            $ref: '#/components/responses/ErrorResponse',
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get a user',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          '200': {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
          '404': {
            $ref: '#/components/responses/ErrorResponse',
          },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update a user',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateUserRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
          '404': {
            $ref: '#/components/responses/ErrorResponse',
          },
          '409': {
            $ref: '#/components/responses/ErrorResponse',
          },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete a user',
        parameters: [{ $ref: '#/components/parameters/UserId' }],
        responses: {
          '204': {
            description: 'User deleted',
          },
          '400': {
            $ref: '#/components/responses/ValidationError',
          },
          '404': {
            $ref: '#/components/responses/ErrorResponse',
          },
        },
      },
    },
  },
  components: {
    parameters: {
      UserId: {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
          pattern: '^[a-fA-F0-9]{24}$',
        },
      },
    },
    responses: {
      ErrorResponse: {
        description: 'Request failed',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ValidationError',
            },
          },
        },
      },
    },
    schemas: {
      User: userResponse,
      CreateUserRequest: userWriteBody,
      UpdateUserRequest: {
        type: 'object',
        minProperties: 1,
        properties: userWriteBody.properties,
      },
      UserResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      UserListResponse: {
        type: 'object',
        required: ['data'],
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
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

const docsHtml = `<!doctype html>
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

      .method.patch {
        background: #7347a6;
      }

      .method.delete {
        background: #a12828;
      }

      code {
        border-radius: 6px;
        background: #eef2f7;
        padding: 3px 6px;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 0.95em;
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

      <h2>Users</h2>
      <section class="endpoint">
        <div class="endpoint-title">
          <span class="method">GET</span>
          <h3><code>/users?name=&amp;email=</code></h3>
        </div>
        <p>Lists users with optional name and email filters.</p>
      </section>
      <section class="endpoint">
        <div class="endpoint-title">
          <span class="method post">POST</span>
          <h3><code>/users</code></h3>
        </div>
        <p>Creates a user from a name and unique email address.</p>
      </section>
      <section class="endpoint">
        <div class="endpoint-title">
          <span class="method">GET</span>
          <h3><code>/users/:id</code></h3>
        </div>
        <p>Returns one user by MongoDB ObjectId.</p>
      </section>
      <section class="endpoint">
        <div class="endpoint-title">
          <span class="method patch">PATCH</span>
          <h3><code>/users/:id</code></h3>
        </div>
        <p>Updates a user's name, email, or both.</p>
      </section>
      <section class="endpoint">
        <div class="endpoint-title">
          <span class="method delete">DELETE</span>
          <h3><code>/users/:id</code></h3>
        </div>
        <p>Deletes a user.</p>
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
