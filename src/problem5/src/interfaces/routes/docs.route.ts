import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

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
      example: 'John Doe',
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'john@example.com',
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
      example: 'John Doe',
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 254,
      example: 'john@example.com',
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

docsRouter.get('/openapi.json', (_request, response) => {
  response.json(openApiDocument);
});

const swaggerUiHandler = swaggerUi.setup(openApiDocument, {
  customSiteTitle: 'A Crude Server API Docs',
});

docsRouter.use('/', swaggerUi.serve, swaggerUiHandler);
