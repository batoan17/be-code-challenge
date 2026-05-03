# Backend Code Challenge

This repository contains my solutions for Problems 4, 5, and 6.

## Solutions

### Solution 4: Three Ways to Sum to `n`

Located in [`src/problem4`](src/problem4).

Implements three TypeScript versions of `sum_to_n`:

- `sum_to_n_a`: arithmetic-series formula with `O(1)` time and `O(1)` space.
- `sum_to_n_b`: straightforward iterative loop with `O(n)` time and `O(1)` space.
- `sum_to_n_c`: two-pointer paired summation that reduces loop iterations while keeping `O(1)` space.

### Solution 5: A Crude Server

Located in [`src/problem5`](src/problem5).

Implements a production-style CRUD API for a `User` resource:

- Express server written in TypeScript.
- Prisma-backed MongoDB persistence.
- Zod validation, centralized error handling, and security middleware.
- Swagger UI at `/docs`, including an OpenAPI JSON endpoint.
- Vitest and Supertest coverage for health, docs, and user flows.

This solution was initialized by my generator, [`generator-t-generator`](https://www.npmjs.com/package/generator-t-generator), and is deployed to <https://problem5-seven.vercel.app/docs/>.

See [`src/problem5/README.md`](src/problem5/README.md) for setup, architecture notes, and API details.

### Solution 6: Live Scoreboard API Specification

Located in [`src/problem6`](src/problem6).

Documents a backend design for a live scoreboard module:

- Authenticated score-event ingestion through `POST /score-events`.
- Durable score persistence with Redis sorted-set caching for fast top-10 reads.
- WebSocket-based realtime updates with polling fallback endpoints.
- Idempotency, authorization, rate limiting, and audit logging to prevent malicious score changes.
- Flow and fanout diagrams for implementation handoff.

See [`src/problem6/README.md`](src/problem6/README.md) for the full specification.
