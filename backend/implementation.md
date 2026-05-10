# Collaborative Trip Planning Backend — Implementation Plan

## Overview

Build a **complete, production-grade** backend for a collaborative trip planning platform using Express.js + TypeScript + Prisma + PostgreSQL (Neon DB). The system spans 12+ modules with strict layered architecture, DTO patterns, Zod validation, JWT auth, permission matrix, transaction handling, and Swagger docs.

## Current State

- **Runtime**: Bun (already set up)
- **Existing files**: Basic Express server (`app/server.ts`), entry point (`index.ts`), empty `auth/` and `types/` dirs, empty `llm.txt`
- **Dependencies installed**: `express`, `cors`, `dotenv`, `@types/express`, `@types/cors`, `@types/bun`

---

## User Review Required

> [!IMPORTANT]
> **Runtime: Bun vs Node.js** — The spec says "Runtime: Node.js" but the project is already initialized with **Bun** (`bun.lock`, `@types/bun`, `bun run --watch`). I will keep **Bun as the runtime** since it's already configured and is fully Node.js-compatible. Prisma, Express, and all listed packages work with Bun. If you want pure Node.js, let me know.

> [!IMPORTANT]
> **Database Connection** — The spec requires Neon DB (PostgreSQL). You'll need to provide a `DATABASE_URL` in `.env`. I'll create a `.env.example` with all required variables. You can set up a free Neon DB at [neon.tech](https://neon.tech).

> [!WARNING]
> **Project Restructure** — The current structure has code under `app/`. The spec requires `src/` as root. I will **move** `app/server.ts` → restructure into the new `src/` layout. The entry point `index.ts` stays at root but will import from `src/`.

> [!IMPORTANT]
> **Scope & Execution** — This is a very large project (~100+ files). I will implement all 17 steps in order as specified. Each step updates `llm.txt`. I'll focus on **correctness and completeness** over speed.

---

## Open Questions

> [!IMPORTANT]
> 1. **Neon DB URL** — Do you already have a Neon DB instance? If so, what's the connection string format? I'll use a placeholder in `.env.example`.
> 2. **File Upload Storage Path** — Where should uploaded files be stored locally? I'll default to `./uploads/` in the project root.
> 3. **CORS Origins** — Any specific frontend origins to whitelist? I'll default to `http://localhost:3000` for development.
> 4. **Bonus Features** — Should I include Socket.io real-time collaboration, or stick to REST-only for the hackathon submission?

---

## Proposed Changes

### Phase 1: Project Restructure & Dependencies (Step 1-2)

#### [MODIFY] [package.json](file:///e:/Web%20Dev/Projects/collab-trip-planning/backend/package.json)
- Add all required dependencies:
  - `prisma`, `@prisma/client` — ORM
  - `zod` — validation
  - `bcryptjs`, `@types/bcryptjs` — password hashing (pure JS, works everywhere)
  - `jsonwebtoken`, `@types/jsonwebtoken` — JWT
  - `multer`, `@types/multer` — file uploads
  - `helmet` — security headers
  - `express-rate-limit` — rate limiting
  - `pino`, `pino-pretty` — structured logging
  - `swagger-ui-express`, `swagger-jsdoc`, `@types/swagger-ui-express`, `@types/swagger-jsdoc` — API docs
  - `http-status-codes` — clean status code constants
- Add scripts: `dev`, `build`, `start`, `prisma:generate`, `prisma:migrate`, `prisma:studio`

#### [MODIFY] [tsconfig.json](file:///e:/Web%20Dev/Projects/collab-trip-planning/backend/tsconfig.json)
- Add `baseUrl`, `paths` for clean imports (`@/modules/*`, `@/common/*`, etc.)
- Keep strict mode, Bun-compatible settings

#### [MODIFY] [index.ts](file:///e:/Web%20Dev/Projects/collab-trip-planning/backend/index.ts)
- Update imports from `./app/server` → `./src/app`

#### [NEW] [.env.example](file:///e:/Web%20Dev/Projects/collab-trip-planning/backend/.env.example)
- All required environment variables

#### [DELETE] app/server.ts → migrated to src/app.ts

---

### Phase 2: Source Directory Structure (Step 3-5)

Create the full `src/` directory tree:

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server startup (imported by root index.ts)
├── config/
│   ├── index.ts              # Config loader
│   ├── database.ts           # Prisma client singleton
│   ├── cors.ts               # CORS configuration
│   └── swagger.ts            # Swagger configuration
├── common/
│   ├── errors/               # Custom error classes
│   ├── permissions/          # Centralized permission matrix
│   ├── responses/            # Standardized API response builder
│   └── interfaces/           # Shared interfaces
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── validate.middleware.ts
│   ├── upload.middleware.ts
│   └── rate-limit.middleware.ts
├── utils/
│   ├── async-handler.ts
│   ├── jwt.ts
│   ├── password.ts
│   ├── pagination.ts
│   ├── date-utils.ts
│   ├── file-utils.ts
│   └── expense-calculator.ts
├── constants/
│   └── index.ts
├── types/
│   └── express.d.ts          # Express request augmentation
├── modules/                  # Feature modules (see below)
├── database/
│   └── prisma/
│       └── schema.prisma
├── docs/
│   └── swagger.json
└── llm.txt
```

---

### Phase 3: Prisma Schema Design (Step 3-4)

#### [NEW] [schema.prisma](file:///e:/Web%20Dev/Projects/collab-trip-planning/backend/prisma/schema.prisma)

**Enums:**
```prisma
enum Role { OWNER EDITOR VIEWER }
enum TripVisibility { PRIVATE SHARED }
enum ActivityStatus { PLANNED CONFIRMED COMPLETED CANCELLED }
enum ChecklistType { PACKING TODO CUSTOM }
enum ReservationType { FLIGHT HOTEL TRAIN BUS EVENT OTHER }
enum SplitType { EQUAL CUSTOM }
enum InviteStatus { PENDING ACCEPTED DECLINED }
```

**Models (10 tables):**

| Model | Key Relations |
|---|---|
| `User` | Has many trips, members, comments, expenses |
| `Trip` | Has many days, members, checklists, attachments, reservations, expenses |
| `TripMember` | User ↔ Trip junction with `Role` |
| `Invite` | Trip invitations with `InviteStatus` |
| `Day` | Belongs to Trip, has many activities |
| `Activity` | Belongs to Day, has many comments |
| `Comment` | Polymorphic: belongs to Day OR Activity |
| `Checklist` → `ChecklistItem` | Nested items with assignment |
| `Attachment` | File metadata linked to Trip |
| `Reservation` | Manual booking records |
| `Expense` → `ExpenseParticipant` | Splitting logic with participants |

**Indexes:**
- `TripMember`: composite unique on `(tripId, userId)`
- `Invite`: composite unique on `(tripId, email)`
- `Day`: index on `(tripId, position)`
- `Activity`: index on `(dayId, position)`
- `Comment`: indexes on `dayId`, `activityId`

**Cascade Rules:**
- Trip delete → cascades to Days, Activities, Comments, Members, Checklists, Attachments, Reservations, Expenses
- Day delete → cascades to Activities
- Checklist delete → cascades to ChecklistItems
- Expense delete → cascades to ExpenseParticipants

---

### Phase 4: Core Infrastructure (Step 5)

#### Common Layer

**Error Classes** (`src/common/errors/`):
```
AppError (base) → ValidationError, AuthenticationError, AuthorizationError,
                   NotFoundError, ConflictError, BadRequestError
```

**Response Builder** (`src/common/responses/`):
```ts
ApiResponse.success(data, message, statusCode)
ApiResponse.error(message, errors, statusCode)
ApiResponse.paginated(data, pagination, message)
```

**Permission Matrix** (`src/common/permissions/`):
- Central `hasPermission(role, action)` function
- Actions enum: `EDIT_TRIP`, `DELETE_TRIP`, `ADD_ACTIVITY`, `COMMENT`, `UPLOAD_FILES`, `MANAGE_BUDGET`, `INVITE_USERS`
- Used by middleware and services — no duplication

#### Middleware Layer

| Middleware | Purpose |
|---|---|
| `auth` | Verify JWT, attach user to `req.user` |
| `error` | Global error handler, formats `AppError` subclasses |
| `validate` | Generic `validateRequest(schema)` for Zod schemas |
| `upload` | Multer config with file type/size validation |
| `rate-limit` | Configurable rate limiter per route group |

#### Utilities

| Utility | Purpose |
|---|---|
| `async-handler` | Wraps async route handlers to catch errors |
| `jwt` | `generateAccessToken`, `generateRefreshToken`, `verifyToken` |
| `password` | `hashPassword`, `comparePassword` |
| `pagination` | `parsePaginationParams`, `buildPaginatedResponse` |
| `expense-calculator` | `calculateEqualSplit`, `validateCustomSplit`, decimal-safe math |

---

### Phase 5-14: Feature Modules

Each module follows the strict structure:

```
modules/{name}/
├── controller/{name}.controller.ts
├── service/{name}.service.ts
├── repository/{name}.repository.ts
├── routes/{name}.routes.ts
├── dto/
│   ├── request/
│   └── response/
├── validation/{name}.validation.ts
├── types/{name}.types.ts
├── mapper/{name}.mapper.ts
└── constants/{name}.constants.ts
```

#### Module Implementation Order

| # | Module | Key Endpoints | Notes |
|---|---|---|---|
| 1 | **auth** | `POST /register`, `POST /login`, `POST /refresh`, `GET /me` | JWT access + refresh tokens |
| 2 | **users** | `GET /users/:id`, `PATCH /users/me` | Profile management |
| 3 | **trips** | Full CRUD `/trips` | Visibility filtering, owner check |
| 4 | **members** | `/trips/:id/members` CRUD | Role-based, ties to permission matrix |
| 5 | **invites** | `/invites` — create, accept, decline | Email-based invite flow |
| 6 | **days** | `/trips/:id/days` CRUD + reorder | Position-based ordering, transactions |
| 7 | **activities** | `/days/:id/activities` CRUD + reorder | Drag-drop reorder via `PATCH /reorder` |
| 8 | **comments** | `/comments` CRUD | Polymorphic (dayId OR activityId) |
| 9 | **checklists** | `/checklists` + `/checklist-items` | Nested items, toggle, reorder |
| 10 | **attachments** | `/trips/:id/attachments` | Multer upload, file validation |
| 11 | **reservations** | `/trips/:id/reservations` CRUD | Type-based (FLIGHT, HOTEL, etc.) |
| 12 | **expenses** | `/trips/:id/expenses` + summary | Equal/custom split, balance calculation |

---

### Phase 15: Swagger Documentation (Step 15)

#### [NEW] [swagger.ts](file:///e:/Web%20Dev/Projects/collab-trip-planning/backend/src/config/swagger.ts)
- OpenAPI 3.0 spec generated from JSDoc annotations + manual schema definitions
- Served at `/api-docs`
- All endpoints documented with request/response schemas

---

### Phase 16: Testing Structure (Step 16)

#### [NEW] Test directory structure
```
tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── modules/
└── helpers/
    └── test-utils.ts
```
- Test configuration with Bun's built-in test runner
- Test utilities for auth mocking, database seeding

---

### Phase 17: Final Cleanup (Step 17)

- Verify all modules are wired
- Ensure `llm.txt` is comprehensive
- Final `.env.example` check
- Code review for `any` types
- Verify all DTOs are used (no raw Prisma model exposure)

---

## File Count Estimate

| Category | Approx. Files |
|---|---|
| Config & Infrastructure | ~15 |
| Common (errors, permissions, responses) | ~10 |
| Middlewares | ~6 |
| Utilities | ~10 |
| Prisma Schema | 1 |
| Module: auth | ~10 |
| Module: users | ~8 |
| Module: trips | ~10 |
| Module: members | ~10 |
| Module: invites | ~10 |
| Module: days | ~10 |
| Module: activities | ~10 |
| Module: comments | ~10 |
| Module: checklists | ~10 |
| Module: attachments | ~10 |
| Module: reservations | ~10 |
| Module: expenses | ~12 |
| Swagger/Docs | ~3 |
| Tests structure | ~5 |
| **Total** | **~160 files** |

---

## Verification Plan

### Automated Tests
- `bun run build` — TypeScript compilation check (if we add a build step)
- `bunx prisma validate` — Schema validation
- `bunx prisma generate` — Client generation
- Health check endpoint test via browser/curl
- Auth flow test (register → login → refresh → access protected route)
- Trip CRUD with permission checks

### Manual Verification
- Start dev server with `bun run dev`
- Test all endpoints via Swagger UI at `/api-docs`
- Verify permission matrix blocks unauthorized actions
- Verify expense split calculations
- Verify file upload restrictions
- Verify pagination on list endpoints
