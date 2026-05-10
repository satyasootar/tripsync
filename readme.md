<p align="center">
  <img src="https://img.shields.io/badge/TripSync-Collaborative%20Trip%20Planning-blue?style=for-the-badge" alt="TripSync" />
</p>

<h1 align="center">TripSync</h1>

<p align="center">
  <b>Plan trips together. Organize itineraries, split expenses, and keep everyone on the same page.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white" alt="Prisma 6" />
  <img src="https://img.shields.io/badge/Bun-Runtime-fbf0df?logo=bun&logoColor=black" alt="Bun" />
  <img src="https://img.shields.io/badge/Neon-Postgres-00E5A0?logo=postgresql&logoColor=white" alt="Neon DB" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## Overview

**TripSync** is a full-stack collaborative trip planning platform where groups of friends, family, or colleagues can plan trips together in real time. Create itineraries, manage expenses with automatic splitting, build checklists, invite collaborators, and keep everything organized in one place.

### Key Features

| Feature | Description |
|---|---|
| **Trip Management** | Create, update, and delete trips with destinations, dates, and visibility settings |
| **Day-by-Day Itineraries** | Build structured itineraries with ordered days and activities per day |
| **Expense Tracking** | Record shared expenses with automatic equal-split among trip members |
| **Checklists** | Create packing lists, to-do lists, and custom checklists with progress tracking |
| **Member Invitations** | Invite collaborators via email with role-based access (Owner / Editor / Viewer) |
| **Real-Time Invites** | Sidebar notification system for pending invitations with Accept / Decline actions |
| **Optimistic UI** | Instant feedback on every action — the UI updates immediately, API calls happen in the background |
| **Skeleton Loading** | Beautiful shimmer placeholders that mirror actual content layout during data fetches |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI library |
| [Vite 7](https://vite.dev) | Build tool & dev server |
| [TypeScript 5.9](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | Accessible component library |
| [Redux Toolkit](https://redux-toolkit.js.org) | Global state management (auth, trips) |
| [Axios](https://axios-http.com) | HTTP client with interceptors |
| [Lucide React](https://lucide.dev) | Icon system |
| [React Router 7](https://reactrouter.com) | Client-side routing |
| [Sonner](https://sonner.emilkowal.dev) | Toast notifications |
| [date-fns](https://date-fns.org) | Date formatting |

### Backend

| Technology | Purpose |
|---|---|
| [Express 5](https://expressjs.com) | Web framework |
| [Bun](https://bun.sh) | JavaScript runtime |
| [TypeScript 5](https://www.typescriptlang.org) | Type safety |
| [Prisma 6](https://www.prisma.io) | ORM & database toolkit |
| [Neon](https://neon.tech) | Serverless Postgres |
| [Zod](https://zod.dev) | Request validation |
| [JWT](https://jwt.io) | Authentication (access + refresh tokens) |
| [Helmet](https://helmetjs.github.io) | Security headers |
| [Pino](https://getpino.io) | Structured logging |
| [Swagger](https://swagger.io) | API documentation |

---

## Project Structure

```
collab-trip-planning/
├── backend/
│   ├── index.ts                    # Server entry point
│   ├── src/
│   │   ├── app.ts                  # Express app configuration
│   │   ├── config/                 # CORS, Swagger, JWT config
│   │   ├── common/                 # Shared responses, errors, DTOs
│   │   ├── middlewares/            # Auth, error, rate-limit middleware
│   │   ├── database/
│   │   │   └── prisma/
│   │   │       ├── schema.prisma   # Database schema
│   │   │       └── seed.ts         # Seed script
│   │   └── modules/
│   │       ├── auth/               # Register, login, refresh, me
│   │       ├── users/              # Profile management
│   │       ├── trips/              # CRUD for trips
│   │       ├── members/            # Trip membership
│   │       ├── invites/            # Email-based invitations
│   │       ├── days/               # Itinerary days
│   │       ├── activities/         # Day activities
│   │       ├── checklists/         # Checklists & items
│   │       ├── expenses/           # Expense tracking & splitting
│   │       ├── comments/           # Comments on days/activities
│   │       ├── attachments/        # File attachments
│   │       └── reservations/       # Flight, hotel, event bookings
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                # App entry point
│   │   ├── App.tsx                 # Router configuration
│   │   ├── index.css               # Tailwind + global styles
│   │   ├── lib/
│   │   │   ├── axios.ts            # Axios instance with JWT interceptor
│   │   │   ├── types.ts            # Shared TypeScript interfaces
│   │   │   └── utils.ts            # Utility functions
│   │   ├── store/
│   │   │   ├── store.ts            # Redux store
│   │   │   ├── auth-slice.ts       # Auth state (login, register, user)
│   │   │   └── trips-slice.ts      # Trips state (CRUD)
│   │   ├── components/
│   │   │   ├── logo.tsx            # SVG brand logo
│   │   │   ├── theme-provider.tsx  # Dark/light mode
│   │   │   ├── layout/
│   │   │   │   └── app-shell.tsx   # Sidebar, nav, pending invites
│   │   │   ├── trips/              # Trip card, create dialog
│   │   │   ├── itinerary/          # Day & activity management
│   │   │   ├── expenses/           # Expense tracking UI
│   │   │   ├── checklists/         # Checklist management
│   │   │   ├── members/            # Members & invites tab
│   │   │   └── ui/                 # shadcn/ui primitives
│   │   └── pages/
│   │       ├── landing.tsx         # Public landing page
│   │       ├── login.tsx           # Sign in
│   │       ├── register.tsx        # Sign up
│   │       ├── dashboard.tsx       # Trip listing
│   │       ├── trip-detail.tsx     # Full trip view (tabs)
│   │       └── settings.tsx        # Profile settings
│   └── package.json
│
└── readme.md
```

### Backend Architecture

Each module follows a **layered architecture**:

```
module/
├── controller/     # Request handling, HTTP status codes
├── service/        # Business logic
├── repository/     # Database queries via Prisma
├── routes/         # Express route definitions
├── dto/            # Zod validation schemas
└── types/          # TypeScript interfaces
```

---

## Database Schema

```mermaid
erDiagram
    User ||--o{ Trip : owns
    User ||--o{ TripMember : "is member of"
    User ||--o{ Invite : sends
    User ||--o{ Expense : "paid by"
    User ||--o{ ExpenseParticipant : shares
    User ||--o{ Comment : writes
    User ||--o{ ChecklistItem : "assigned to"

    Trip ||--o{ TripMember : has
    Trip ||--o{ Invite : has
    Trip ||--o{ Day : has
    Trip ||--o{ Checklist : has
    Trip ||--o{ Expense : has
    Trip ||--o{ Attachment : has
    Trip ||--o{ Reservation : has

    Day ||--o{ Activity : contains
    Day ||--o{ Comment : has
    Activity ||--o{ Comment : has
    Checklist ||--o{ ChecklistItem : has
    Expense ||--o{ ExpenseParticipant : splits
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+) — backend runtime
- [Node.js](https://nodejs.org) (v20+) — frontend tooling
- A PostgreSQL database (we recommend [Neon](https://neon.tech) for serverless Postgres)

### 1. Clone the Repository

```bash
git clone https://github.com/satyasootar/tripsync.git
cd tripsync
```

### 2. Backend Setup

```bash
cd backend
bun install
```

Create a `.env` file in `backend/`:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# JWT
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Server
PORT=8000
NODE_ENV="development"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./uploads"
```

Run database migrations and start the server:

```bash
bun run prisma:generate
bun run prisma:migrate
bun run dev
```

The API will be available at `http://localhost:8000` with Swagger docs at `http://localhost:8000/api-docs`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Reference

The backend serves a full REST API under `/api/v1`. Interactive documentation is available via **Swagger UI** at `/api-docs` when the server is running.

### Endpoints Overview

| Module | Endpoints | Auth |
|---|---|---|
| **Auth** | `POST /register`, `POST /login`, `POST /refresh`, `GET /me` | Public / Protected |
| **Users** | `GET /me`, `PATCH /me` | Protected |
| **Trips** | Full CRUD | Protected |
| **Members** | `GET /trip/:tripId`, manage membership | Protected |
| **Invites** | `POST /`, `GET /trip/:tripId`, `GET /my`, `POST /:id/respond` | Protected |
| **Days** | `POST /trip/:tripId`, `GET /trip/:tripId`, CRUD | Protected |
| **Activities** | `POST /day/:dayId`, CRUD | Protected |
| **Checklists** | Full CRUD + items management | Protected |
| **Expenses** | Full CRUD with participant splitting | Protected |
| **Comments** | CRUD on days and activities | Protected |
| **Attachments** | File upload & management | Protected |
| **Reservations** | Flight, hotel, event bookings | Protected |

### Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained via `/api/v1/auth/login` and refreshed via `/api/v1/auth/refresh`.

---

## Design Decisions

### Optimistic UI

Every mutation (create, update, delete, toggle) applies instantly to the local state before the API call. If the API fails, the state is reverted to its previous snapshot and an error toast is shown. Temporary items use `temp-` prefixed IDs until the server responds.

### Tab-Level Caching

Each tab (Itinerary, Expenses, Checklists, Members) maintains a module-level cache keyed by `tripId`. This prevents redundant API calls and eliminates UI flickering when switching between tabs.

### Skeleton Loading

Loading states use structured `Skeleton` components that mirror the exact layout of the real content — cards, avatars, progress bars, list items — rather than generic block placeholders. This gives a premium, native-app feel.

### Role-Based Access

Members have one of three roles:

| Role | Permissions |
|---|---|
| **Owner** | Full access, can delete trip |
| **Editor** | Can modify itineraries, expenses, checklists |
| **Viewer** | Read-only access |

---

## Scripts

### Backend

| Script | Command | Description |
|---|---|---|
| Dev server | `bun run dev` | Start with hot reload |
| Production | `bun run start` | Start without watch mode |
| Generate Prisma | `bun run prisma:generate` | Regenerate Prisma client |
| Migrate | `bun run prisma:migrate` | Run database migrations |
| Prisma Studio | `bun run prisma:studio` | Open visual DB editor |
| Seed | `bun run prisma:seed` | Seed the database |
| Tests | `bun test` | Run integration tests |

### Frontend

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start Vite dev server |
| Build | `npm run build` | TypeScript check + production build |
| Type check | `npm run typecheck` | Run `tsc --noEmit` |
| Lint | `npm run lint` | ESLint |
| Format | `npm run format` | Prettier |
| Preview | `npm run preview` | Preview production build |

---

## Environment Variables

### Backend (`.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_ACCESS_SECRET` | Secret for access tokens | — |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | — |
| `JWT_ACCESS_EXPIRATION` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRATION` | Refresh token TTL | `7d` |
| `PORT` | Server port | `8000` |
| `NODE_ENV` | Environment | `development` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `5242880` (5 MB) |
| `UPLOAD_DIR` | Upload directory path | `./uploads` |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with care by <a href="https://github.com/satyasootar">satyasootar</a>
</p>
