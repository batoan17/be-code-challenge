# Problem 5: A Crude Server

This solution is deployed at https://problem5-seven.vercel.app/docs/.

The project was initialized with my TypeScript Nodejs generator, [`generator-t-generator`](https://www.npmjs.com/package/generator-t-generator). The generated baseline gives the service a clean architecture structure from the start, separating HTTP delivery, application use cases, domain types, infrastructure repositories, and shared framework concerns.

## Specifications

### 1. CRUD interface

The server provides a `User` resource with the required CRUD operations:

| Requirement | Endpoint | Implementation |
| --- | --- | --- |
| Create a resource | `POST /users` | Creates a user with `name` and `email`. |
| List resources with basic filters | `GET /users?name=&email=` | Lists users and supports case-insensitive `name` and `email` filters. |
| Get details of a resource | `GET /users/:id` | Returns a single user by MongoDB ObjectId. |
| Update resource details | `PATCH /users/:id` | Updates `name`, `email`, or both. |
| Delete a resource | `DELETE /users/:id` | Deletes a user and returns `204 No Content`. |

The API also includes:

- `GET /docs` for Swagger UI documentation.
- `GET /docs/openapi.json` for the OpenAPI document.
- `GET /health` for service and database health checks.

### 2. Database persistence

The backend uses Prisma with MongoDB for data persistence. The `User` model is defined in `prisma/schema.prisma` with:

- `id` as a MongoDB ObjectId.
- `name` and unique `email` fields.
- `createdAt` and `updatedAt` timestamps.

### 3. Configuration and running the application

Create or update `.env` with:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
API_KEY=
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
```

All runtime API endpoints require the key in the `x-api-key` header. Swagger UI is pre-authorized from `API_KEY`, so requests sent from `/docs` include the header by default.

Install dependencies:

```bash
npm install
```

Generate the Prisma client and push the schema:

```bash
npm run db:init
```

Run the app in development:

```bash
npm run dev
```

Build and run the compiled server:

```bash
npm run build
npm start
```

Run checks:

```bash
npm run lint
npm test
```

## Project Structure

```text
src/
  app.ts                         Express app composition and middleware
  server.ts                      Local server bootstrap and graceful shutdown
  config/                        Environment parsing and logger setup
  domain/                        Framework-independent domain types
  usecases/                      Application actions for health and users
  interfaces/
    controllers/                 Express request handlers
    routes/                      HTTP route definitions and Swagger docs
    validators/                  Zod request validation schemas
  infrastructure/
    prisma/                      Prisma client setup
    repositories/                Database-backed repository implementations
  shared/                        Error handling, HTTP errors, shutdown helpers
prisma/
  schema.prisma                  MongoDB schema
  seed.ts                        Seed data for local development
tests/                           API tests with Vitest and Supertest
```

## Architecture Notes

The service follows clean architecture boundaries:

- `domain` contains the core `User` and filter/input types without Express or Prisma dependencies.
- `usecases` coordinate application behavior through the repository layer instead of HTTP details.
- `interfaces` adapts HTTP requests to use cases, including routing, controllers, validation, and API documentation.
- `infrastructure` owns persistence details through Prisma and maps database records back to domain objects.
- `shared` keeps cross-cutting concerns like error middleware and graceful shutdown outside business logic.

This keeps the CRUD workflow testable and easy to change: HTTP validation can evolve without changing the database layer, and Prisma-specific error handling stays isolated in the repository layer.
