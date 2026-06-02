# Needy games!

Full-stack game backlog manager with a retro-gaming aesthetic. Stop hoarding, start finishing.

![Theme](https://img.shields.io/badge/theme-dark%20mode-black)
![Backend](https://img.shields.io/badge/backend-Express.js%20%2B%20Prisma%20%2B%20MySQL-blue)
![Frontend](https://img.shields.io/badge/frontend-Nuxt%203%20%2B%20Vue%203%20%2B%20Tailwind%20CSS-green)

---

## Overview

**Needy games!** helps gamers organize their backlog and decide what to play next using a priority algorithm (`metacritic_score / hours_to_complete`).

- **Backend**: RESTful API built with Express.js 5, Prisma ORM, MySQL 8, Zod validation, and JWT authentication.
- **Frontend**: Single Page Application (SPA) built with Nuxt 3, Vue 3 Composition API, Tailwind CSS, and Pinia state management.
- **Design**: Dark-mode-first, retro gaming aesthetic using Pixelify Sans typography with neon green and purple accents.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 24+ |
| Backend Framework | Express.js 5.x |
| ORM | Prisma |
| Database | MySQL 8 |
| Validation | Zod (backend + frontend) |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| IDs | ULID |
| Frontend Framework | Nuxt 3 (Vue 3) |
| Styling | Tailwind CSS |
| State Management | Pinia |
| HTTP Client | `$fetch` / `ofetch` (Nuxt built-in) |

---

## Project Structure

```
final-proyect/
├── docs/
│   └── tech-doc.md              # Full API contract & data model docs
├── backend/                     # Express API
│   ├── index.js                 # Entry point (server bootstrap)
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.js              # Seed data
│   ├── src/
│   │   ├── index.js             # Route registration (explicit app.METHOD)
│   │   ├── controllers/         # HTTP handlers per resource
│   │   ├── db/prisma.js         # PrismaClient singleton
│   │   ├── errors/              # Custom error classes
│   │   ├── middlewares/         # auth, errorHandler, notFound
│   │   ├── repositories/        # Prisma data access layer
│   │   ├── transformers/        # DTO / response mappers
│   │   ├── useCases/            # Business logic (Zod validation + orchestration)
│   │   ├── utils/               # validate.js, helpers
│   │   └── validations/         # Zod schemas per resource & action
│   └── vercel.json
└── frontend/                    # Nuxt 3 SPA
    ├── nuxt.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── app.vue              # Root layout
        ├── assets/css/          # Global styles
        ├── components/          # Reusable Vue components
        ├── composables/         # Shared logic
        ├── layouts/             # Page layouts
        ├── middleware/          # Route middleware (auth)
        ├── pages/               # File-based routing
        ├── plugins/             # App plugins
        └── stores/              # Pinia stores
```

---

## Getting Started

### Prerequisites

- Node.js `>= 24`
- MySQL `8.x`
- npm

### 1. Clone & Install

```bash
git clone <repo-url>
cd final-proyect

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Variables

Create `.env` files in both `backend/` and `frontend/`.

**Backend (`backend/.env`)**:
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/needy_games"
JWT_SECRET="your_super_secret_jwt_key"
PORT=3001
```

**Frontend (`frontend/.env`)**:
```env
API_BASE_URL=http://localhost:3001
```

### 3. Database Setup

```bash
cd backend

# Run migrations
npm run db:migrate

# Seed default data (default user, categories, tags)
npm run db:seed

# (Optional) Open Prisma Studio GUI
npm run db:studio
```

### 4. Run Development Servers

**Backend** (port 3001):
```bash
cd backend
npm run dev
```

**Frontend** (port 3002):
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3002` and the API at `http://localhost:3001`.

---

## Backend Architecture

### Routing

Routes are defined **explicitly** in `backend/src/index.js` using `app.METHOD` (no Express sub-routers):

```js
app.get('/games', auth({ required: true }), listGamesCtrl)
app.post('/games', auth({ required: true }), createGameCtrl)
```

### Request Lifecycle

```
HTTP Request
    -> Route Registration (src/index.js)
    -> Middleware (auth, errorHandler, notFound)
    -> Controller (HTTP handler)
    -> Use Case (business logic + Zod validation)
    -> Repository (Prisma data access)
    -> Transformer (DTO / response mapping)
    -> JSON Response
```

### Key Conventions

| Convention | Implementation |
|------------|----------------|
| **Soft Deletes** | All entities have `deleted_at`. Repositories filter by `deleted_at: null`. |
| **Pagination** | Standard envelope: `{ data, meta: { pagination: { current_page, per_page, total_pages, total_items } } }` |
| **Validation** | Zod schemas in `src/validations/`. Use Cases call `validate(schema, req.body)`. |
| **Auth** | `auth({ required: false })` allows anonymous; `auth({ required: true })` requires valid JWT. |
| **Error Handling** | Centralized `errorHandler` middleware returns consistent error envelopes. |

---

## API Specification (Summary)

Base URL: `http://localhost:3001`

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new account | No |
| POST | `/auth/login` | Login and receive JWT | No |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | Get current user profile | Yes |
| PUT | `/users/me` | Update own profile | Yes |

### Games

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/games` | List games (paginated, filterable) | Yes |
| GET | `/games/:id` | Get single game | Yes |
| POST | `/games` | Create a new game | Yes |
| PUT | `/games/:id` | Update game | Yes |
| DELETE | `/games/:id` | Soft-delete game | Yes |
| PATCH | `/games/:id/complete` | Mark as completed | Yes |

**Query Parameters for GET /games**:
- `page`, `per_page`
- `sort`: `priority` (default), `score`, `hours`, `status`
- `status`: `pending` | `completed`
- `category_id`, `tag`, `search`

### Categories & Tags

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/categories` | List categories | No |
| GET | `/tags` | List tags | No |
| POST / PUT / DELETE | `/categories`, `/tags` | Admin CRUD | Admin |

### Response Format

**Success (single)**:
```json
{ "data": { ... } }
```

**Success (paginated list)**:
```json
{
  "data": [ ... ],
  "meta": {
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total_pages": 5,
      "total_items": 50
    }
  }
}
```

**Error**:
```json
{ "message": "Validation failed", "errors": [ { "path": ["email"], "message": "Invalid email" } ] }
```

For the full API contract, see [`docs/tech-doc.md`](./docs/tech-doc.md).

---

## Frontend Architecture

### Routing (File-Based)

Nuxt 3 auto-generates routes from the `src/pages/` directory:

| File | Route |
|------|-------|
| `pages/index.vue` | `/` |
| `pages/login.vue` | `/login` |
| `pages/registro.vue` | `/registro` |
| `pages/juegos/index.vue` | `/juegos` |
| `pages/juegos/nuevo.vue` | `/juegos/nuevo` |
| `pages/juegos/[id].vue` | `/juegos/:id` |
| `pages/juegos/edicion/[id].vue` | `/juegos/edicion/:id` |

### State Management

- **Pinia** stores in `src/stores/`:
  - `useGameStore`: games, categories, tags, CRUD actions.
  - `useSessionStore`: auth state, JWT handling, login/logout.

### Validation

Client-side validation uses **Zod** (aligned with backend schemas) in `src/validations/`.

### Responsive Design (Mobile-First)

Tailwind CSS utility classes with breakpoints (`sm:`, `md:`, `lg:`, `xl:`).

Examples:
```vue
<!-- Grid grows from 1 col (mobile) to 4 cols (desktop) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

<!-- Flex column on mobile, row on tablet+ -->
<div class="flex flex-col sm:flex-row items-center gap-4">

<!-- Hide on mobile, show on desktop -->
<nav class="hidden md:flex">...</nav>
```

---

## Available Scripts

### Backend

```bash
npm run dev          # Start with nodemon (watch mode)
npm start            # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with default data
npm run db:studio    # Open Prisma Studio GUI
npm test             # Run Jest tests
```

### Frontend

```bash
npm run dev          # Start Nuxt dev server with --host
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
```

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0D0D0F` |
| Surface | `#1A1A1F` |
| Text Primary | `#E0E0E0` |
| Primary (Neon Green) | `#39FF14` |
| Accent (Neon Purple) | `#BF00FF` |
| Title Font | [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) |
| Body Font | Inter / Source Sans 3 |

---

## License

MIT
