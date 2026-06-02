# AGENTS.md — Needy games!

## Project Overview

Full-stack game backlog manager.
- **Backend**: Express.js + Prisma + MySQL API (Node 24+).
- **Frontend**: Nuxt 3 + Vue 3 + Tailwind CSS + Pinia (Node 24+).
- **Theme**: Dark mode default. Retro gaming aesthetic with Pixelify Sans typography and neon green/purple accents.

## Workspace Structure

```
final-proyect/
├── docs/
│   └── tech-doc.md              # API & data contract documentation
├── backend/                     # Express API
│   ├── index.js                 # Entry point
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── index.js             # Route registration
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
    ├── src/
    │   ├── app.vue
    │   ├── assets/css/
    │   ├── components/
    │   ├── composables/
    │   ├── layouts/
    │   ├── middleware/
    │   ├── pages/
    │   ├── plugins/
    │   └── stores/
    └── vercel.json
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 24+ |
| Framework (BE) | Express.js 5.x |
| ORM | Prisma |
| Database | MySQL 8 |
| Validation | Zod |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| IDs | ULID |
| Framework (FE) | Nuxt 3 (Vue 3) |
| Styling | Tailwind CSS |
| State | Pinia |
| HTTP | `$fetch` / `ofetch` (Nuxt built-in) |

## Conventions

- **Backend routes** are defined explicitly in `src/index.js` using `app.METHOD` (no Express sub-routers).
- **Architecture**: Controllers → Use Cases → Repositories → Transformers.
- **Soft deletes**: All entities have `deleted_at`. Use `deleted_at: null` filters in repositories.
- **Pagination**: Standard envelope `{data, meta: {pagination: {current_page, per_page, total_pages, total_items}}}`.
- **Auth middleware**: `auth({ required: false })` allows anonymous; `auth({ required: true })` requires valid JWT. Sprint 1 game routes skip auth.
- **Sprint 1**: No auth on game routes. Default user in DB owns all games.
- **Sprint 2**: Auth activates. Games scoped to `req.userSession.id`. Categories/Tags remain admin-only for writes.
