# Frontend Progress — Collaborative Trip Planner

## Project Overview
A full frontend for a collaborative trip planning platform. Built with Vite 7 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (radix-maia style, hugeicons, Figtree font). Backend runs on `http://localhost:8000/api/v1/*` (Express + Bun + Prisma + Neon DB).

## Tech Decisions (Confirmed)
- **Router**: React Router v7 (`react-router`)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)
- **HTTP Client**: Axios with Axios instance (`axios`)
- **Toasts**: Sonner (shadcn-recommended)
- **Dark Mode**: NO — light-only, chilled vibe
- **Icons**: `@hugeicons/react` + `@hugeicons/core-free-icons`
- **Font**: Figtree Variable (already installed)
- **shadcn style**: `radix-maia`, base color `neutral`, icon library `hugeicons`
- **CSS**: Tailwind CSS v4 with `@theme inline` blocks, semantic color tokens only

## Design Direction: "Light & Chilled"
- Neutral/monochrome base with soft teal/sage accent for primary actions
- Generous whitespace, rounded corners, minimal shadows
- Figtree font — friendly and modern
- Subtle fade-in animations, smooth transitions
- Friendly empty states with icons and encouraging copy
- NO dark mode

## Seeded Test Data (Backend)
All accounts use password: `password123`
1. `alice@example.com` — Trip Owner
2. `bob@example.com` — Editor
3. `charlie@example.com` — Viewer

Trip: "Paris Getaway" with 2 days, activities, packing checklist, and shared expense.

## File Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx          # Main authenticated layout with sidebar
│   │   ├── top-bar.tsx            # Breadcrumb + user dropdown
│   │   └── protected-route.tsx    # Auth guard redirect
│   ├── trips/
│   │   ├── trip-card.tsx          # Trip card for dashboard grid
│   │   └── create-trip-dialog.tsx # Dialog for new trip creation
│   ├── itinerary/
│   │   ├── itinerary-tab.tsx      # Days + Activities timeline
│   │   ├── day-card.tsx           # Single day with activities list
│   │   ├── activity-item.tsx      # Single activity display
│   │   └── add-activity-sheet.tsx # Sheet for add/edit activity
│   ├── expenses/
│   │   ├── expenses-tab.tsx       # Expense list + summary
│   │   ├── expense-card.tsx       # Single expense display
│   │   └── add-expense-dialog.tsx # Dialog for new expense
│   ├── checklists/
│   │   ├── checklists-tab.tsx     # All checklists for a trip
│   │   ├── checklist-card.tsx     # Single checklist with items
│   │   └── checklist-item.tsx     # Checkbox item row
│   ├── members/
│   │   ├── members-tab.tsx        # Member list + pending invites
│   │   ├── invite-dialog.tsx      # Dialog for inviting by email
│   │   └── member-row.tsx         # Single member display
│   └── ui/                        # shadcn auto-installed components
├── store/
│   ├── index.ts                   # Redux store config
│   ├── auth-slice.ts              # Auth state (user, token, login/logout)
│   ├── trips-slice.ts             # Trips CRUD state
│   └── hooks.ts                   # Typed useAppDispatch/useAppSelector
├── lib/
│   ├── axios.ts                   # Axios instance with interceptors
│   ├── types.ts                   # Shared TS interfaces
│   └── utils.ts                   # cn() helper (existing)
├── pages/
│   ├── landing.tsx                # Minimal hero + login button
│   ├── login.tsx                  # Email + password form
│   ├── register.tsx               # Registration form
│   ├── dashboard.tsx              # Trip grid (home for authed users)
│   ├── trip-detail.tsx            # Single trip with tabs
│   └── settings.tsx               # Profile settings
├── App.tsx                        # Route definitions
├── main.tsx                       # Entry: Provider wrappers
└── index.css                      # Tailwind + shadcn theme
```

## API Route Map
| Frontend Action | Method | Backend Endpoint |
|---|---|---|
| Register | POST | `/api/v1/auth/register` |
| Login | POST | `/api/v1/auth/login` |
| Refresh Token | POST | `/api/v1/auth/refresh` |
| Get Current User | GET | `/api/v1/auth/me` |
| Update Profile | PATCH | `/api/v1/users/me` |
| List Trips | GET | `/api/v1/trips` |
| Create Trip | POST | `/api/v1/trips` |
| Get Trip | GET | `/api/v1/trips/:id` |
| Update Trip | PATCH | `/api/v1/trips/:id` |
| Delete Trip | DELETE | `/api/v1/trips/:id` |
| List Days | GET | `/api/v1/days/trip/:tripId` |
| Create Day | POST | `/api/v1/days/trip/:tripId` |
| Update Day | PATCH | `/api/v1/days/:id` |
| Delete Day | DELETE | `/api/v1/days/:id` |
| Create Activity | POST | `/api/v1/activities/day/:dayId` |
| Update Activity | PATCH | `/api/v1/activities/:id` |
| Delete Activity | DELETE | `/api/v1/activities/:id` |
| List Expenses | GET | `/api/v1/expenses/trip/:tripId` |
| Expense Summary | GET | `/api/v1/expenses/trip/:tripId/summary` |
| Create Expense | POST | `/api/v1/expenses` |
| List Checklists | GET | `/api/v1/checklists/trip/:tripId` |
| Create Checklist | POST | `/api/v1/checklists` |
| Add Checklist Item | POST | `/api/v1/checklists/:checklistId/items` |
| Update Checklist Item | PATCH | `/api/v1/checklists/items/:id` |
| List Members | GET | `/api/v1/members/trip/:tripId` |
| Send Invite | POST | `/api/v1/invites` |
| Get Trip Invites | GET | `/api/v1/invites/trip/:tripId` |
| Respond to Invite | POST | `/api/v1/invites/:id/respond` |
| List Reservations | GET | `/api/v1/reservations/trip/:tripId` |
| List Attachments | GET | `/api/v1/attachments/trip/:tripId` |
| List Comments (Day) | GET | `/api/v1/comments/day/:dayId` |
| List Comments (Activity) | GET | `/api/v1/comments/activity/:activityId` |

## Execution Steps & Progress

### Phase 1: Infrastructure
- [ ] Step 1: Install dependencies (`react-router`, `axios`, `@reduxjs/toolkit`, `react-redux`, `sonner`, `date-fns`)
- [ ] Step 2: Install shadcn components via CLI (card, dialog, sheet, tabs, input, avatar, badge, separator, skeleton, dropdown-menu, sidebar, breadcrumb, checkbox, select, calendar, alert, empty, field, spinner, scroll-area, tooltip)
- [ ] Step 3: Create `lib/types.ts` — shared TypeScript interfaces
- [ ] Step 4: Create `lib/axios.ts` — Axios instance with JWT interceptor + auto-refresh
- [ ] Step 5: Create `store/` — Redux store, auth slice, typed hooks
- [ ] Step 6: Set up routing in `App.tsx` + `main.tsx`

### Phase 2: Layout
- [ ] Step 7: Build `components/layout/app-shell.tsx` — sidebar + main area
- [ ] Step 8: Build `components/layout/top-bar.tsx` — breadcrumb + user dropdown
- [ ] Step 9: Build `components/layout/protected-route.tsx` — auth guard

### Phase 3: Auth Pages
- [ ] Step 10: Build `pages/landing.tsx` — minimal hero
- [ ] Step 11: Build `pages/login.tsx` — login form
- [ ] Step 12: Build `pages/register.tsx` — registration form

### Phase 4: Dashboard
- [ ] Step 13: Build `pages/dashboard.tsx` — trip grid
- [ ] Step 14: Build `components/trips/trip-card.tsx`
- [ ] Step 15: Build `components/trips/create-trip-dialog.tsx`

### Phase 5: Trip Detail (Core)
- [ ] Step 16: Build `pages/trip-detail.tsx` — tabbed layout
- [ ] Step 17: Build Itinerary tab (day cards, activity items, add activity sheet)
- [ ] Step 18: Build Expenses tab (expense list, summary, add expense dialog)
- [ ] Step 19: Build Checklists tab (checklist cards, items, inline add)
- [ ] Step 20: Build Members tab (member list, invite dialog)

### Phase 6: Settings
- [ ] Step 21: Build `pages/settings.tsx` — profile edit

### Phase 7: Polish
- [x] Step 22: Theme tuning (teal accent, soft gradients)
- [x] Step 23: Animations and transitions
- [x] Step 24: Empty states and loading skeletons
- [x] Step 25: Toast notifications for all mutations
- [x] Step 26: Branding Overhaul (Lucide icons, Custom SVG Logo)
- [x] Step 27: Project Documentation (README, Approach, Learnings, Tech Stack)
- [x] Step 28: Final build verification

## Backend Context (For Reference)
- **Server**: Bun + Express on port 8000
- **DB**: Prisma ORM → Neon PostgreSQL
- **Auth**: JWT access + refresh tokens. Access token in `Authorization: Bearer <token>` header.
- **Response format**: `{ success: boolean, message: string, data: T, statusCode: number }`
- **Validation**: Zod schemas on request body
- **Roles**: `OWNER`, `EDITOR`, `VIEWER` (MemberRole enum)
- **Enums**: `TripVisibility` (PRIVATE, SHARED), `ActivityStatus` (PLANNED, CONFIRMED, COMPLETED, CANCELLED), `ChecklistType` (PACKING, TODO, CUSTOM), `SplitType` (EQUAL, CUSTOM), `InviteStatus` (PENDING, ACCEPTED, DECLINED)

## shadcn/ui Rules (Quick Reference)
- Use `FieldGroup` + `Field` for forms, never raw divs
- Use `gap-*` not `space-y-*`
- Use `size-*` when width=height
- Use `data-icon` on icons inside Button
- Use semantic colors (`bg-primary`, `text-muted-foreground`), never raw Tailwind colors
- Use `cn()` for conditional classes
- Always add `AvatarFallback` with `Avatar`
- Tabs: `TabsTrigger` must be inside `TabsList`
- Card: Use full composition (Header/Title/Description/Content/Footer)
- Icons from `@hugeicons/react`, no sizing classes on icons inside components
