# Needy games! - API REST Technical Documentation

## 1. Users (`users`)

| Field | Required | Type | Details |
|-------|----------|------|---------|
| id | Yes | ULID | Unique identifier, auto-generated, immutable |
| alias | Yes | Text | Display name with personality (e.g., "NeonSlayer") |
| email | Yes | Text | Valid email address (unique) |
| password | Yes | Text | Encrypted password (bcrypt) |
| role | Yes | Enum/Text | Values: "user", "admin" |
| is_active | Yes | Boolean | Whether the account is enabled |
| created_at | Yes | Timestamp | When the record was created |
| updated_at | Yes | Timestamp | When the record was last modified |
| deleted_at | No | Timestamp | Soft-delete timestamp; null if active |

**Sprint 1 Note:** A default user is seeded (`id: "01ARZ3NDK9X4C5D6E7F8G9H0J"`, alias: "GamerDefault", email: "default@game.app", role: "user"). All Sprint 1 games are associated to this user without requiring authentication.

---

## 2. Games (`games`)

| Field | Required | Type | Details |
|-------|----------|------|---------|
| id | Yes | ULID | Unique identifier, auto-generated, immutable |
| user_id | Yes | Reference (ULID) | Owner of the game. Sprint 1: always the default user |
| name | Yes | Text | Game title (e.g., "Hades") |
| category_id | Yes | Reference (ULID) | Links to `categories` |
| description | No | Text | Short description or personal notes |
| cover_image_url | No | Text | URL or path to game cover image |
| metacritic_score | Yes | Integer | Metacritic user score (0-100) |
| hours_to_complete | Yes | Decimal number | Estimated hours to complete (HLTB reference) |
| priority_score | No | Decimal number | **Computed**: `metacritic_score / hours_to_complete` |
| status | Yes | Enum/Text | Values: "pending", "completed" |
| completed_at | No | Timestamp | Auto-set when status changed to "completed" |
| completion_notes | No | Text | Optional message when completing |
| completion_rating | No | Integer | 1-5 star rating when completed |
| created_at | Yes | Timestamp | When the record was created |
| updated_at | Yes | Timestamp | When the record was last modified |
| deleted_at | No | Timestamp | Soft-delete timestamp; null if active |

### Tag Relationship
Games have many tags via the `game_tags` pivot table.

---

## 3. Categories (`categories`)

Admin-managed. Users can only list/filter by categories.

| Field | Required | Type | Details |
|-------|----------|------|---------|
| id | Yes | ULID | Unique identifier, auto-generated, immutable |
| name | Yes | Text | Category name (e.g., "RPG", "Shooter", "Indie") |
| sort_order | No | Whole number | Determines display order in filters |
| is_active | Yes | Boolean | Whether the category is visible to users |
| created_at | Yes | Timestamp | When the record was created |
| updated_at | Yes | Timestamp | When the record was last modified |
| deleted_at | No | Timestamp | Soft-delete timestamp; null if active |

---

## 4. Tags (`tags`)

Admin-managed. Users can only list/filter by tags.

| Field | Required | Type | Details |
|-------|----------|------|---------|
| id | Yes | ULID | Unique identifier, auto-generated, immutable |
| name | Yes | Text | Tag label (e.g., "zombies", "indie", "strategy") |
| slug | Yes | Text | URL-friendly version (unique) |
| created_at | Yes | Timestamp | When the record was created |
| updated_at | Yes | Timestamp | When the record was last modified |
| deleted_at | No | Timestamp | Soft-delete timestamp; null if active |

---

## API Routes

### Auth (`/auth`) — Sprint 2

| Method | Path | Description | Who can call |
|--------|------|-------------|--------------|
| POST | `/auth/register` | Register new gamer account | Anonymous |
| POST | `/auth/login` | Authenticate and receive JWT | Anonymous |

### Users (`/users`) — Sprint 2

| Method | Path | Description | Who can call |
|--------|------|-------------|--------------|
| GET | `/users/me` | Get current authenticated user profile | Registered |
| PUT | `/users/me` | Update own profile | Registered |

### Games (`/games`)

| Method | Path | Description | Who can call |
|--------|------|-------------|--------------|
| GET | `/games` | List games with sorting, filtering and search. Sprint 2: returns only the authenticated user's games. | Sprint 1: Anonymous. Sprint 2: Required (own games only) |
| GET | `/games/:id` | Get single game details | Sprint 1: Anonymous. Sprint 2: Required (own game) |
| POST | `/games` | Create a new game | Sprint 1: Anonymous. Sprint 2: Required |
| PUT | `/games/:id` | Update game details | Sprint 1: Anonymous. Sprint 2: Required (own game) |
| DELETE | `/games/:id` | Soft-delete a game | Sprint 1: Anonymous. Sprint 2: Required (own game) |
| PATCH | `/games/:id/complete` | Mark game as completed. Auto-sets `completed_at`. Accepts optional `completion_notes` and `completion_rating` (1-5). | Sprint 1: Anonymous. Sprint 2: Required (own game) |

### Categories (`/categories`)

| Method | Path | Description | Who can call |
|--------|------|-------------|--------------|
| GET | `/categories` | List active categories | Anyone |
| GET | `/categories/:id` | Get category by ID | Anyone |
| POST | `/categories` | Create new category | Admin |
| PUT | `/categories/:id` | Update category | Admin |
| DELETE | `/categories/:id` | Soft-delete category | Admin |

### Tags (`/tags`)

| Method | Path | Description | Who can call |
|--------|------|-------------|--------------|
| GET | `/tags` | List tags | Anyone |
| GET | `/tags/:id` | Get tag by ID | Anyone |
| POST | `/tags` | Create new tag | Admin |
| PUT | `/tags/:id` | Update tag | Admin |
| DELETE | `/tags/:id` | Soft-delete tag | Admin |

---

## API Specification - Requests & Responses

### Standard Response Format

**Success (single object):**
```json
{
  "data": { ... }
}
```

**Success (paginated list):**
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

**Error (400 - JSON malformed):**
```json
{ "message": "Invalid JSON in request body" }
```

**Error (400 - ZOD validation failed):**
```json
{
  "message": "Validation failed",
  "errors": [
    { "path": ["email"], "message": "Invalid email format" },
    { "path": ["password"], "message": "Must be at least 6 characters" }
  ]
}
```

**Error (401):**
```json
{ "message": "Authentication required" }
```

**Error (403):**
```json
{ "message": "Admin access required" }
```

**Error (404):**
```json
{ "message": "Resource not found" }
```

**Error (409):**
```json
{ "message": "Conflict description" }
```

**Error (500):**
```json
{ "message": "An unexpected error occurred" }
```

---

### Games (`/games`)

#### [GET] /games

**Auth:** Sprint 1: No. Sprint 2: Required (returns only `req.userSession` games).  
**Query:** `?page=1&per_page=10&sort=priority|score|hours|status&status=pending|completed&category_id=&tag=&search=`

| Status | Body |
|--------|------|
| **200** | `{ "data": [ { "id": "01ARZ...", "name": "Hades", "metacritic_score": 93, "hours_to_complete": 25.5, "priority_score": 3.65, "status": "pending", "category": { "id": "...", "name": "Rogue-like" }, "tags": [{ "id": "...", "name": "indie" }], "cover_image_url": "...", "created_at": "..." } ], "meta": { "pagination": { ... } } }` |
| **401** | `{ "message": "Authentication required" }` (Sprint 2) |
| **500** | `{ "message": "An unexpected error occurred" }` |

#### [POST] /games

**Auth:** Sprint 1: No. Sprint 2: Required.

**Body:**
```json
{
  "name": "Hades",
  "category_id": "01ARZ...",
  "description": "Roguelike from Supergiant Games",
  "cover_image_url": "https://...",
  "metacritic_score": 93,
  "hours_to_complete": 25.5,
  "tag_ids": ["01ARZ...", "01ARZ..."]
}
```

| Status | Body |
|--------|------|
| **201** | `{ "data": { "id": "01ARZ...", "name": "Hades", "priority_score": 3.65, "status": "pending", ... } }` |
| **400** | `{ "message": "Validation failed", "errors": [...] }` |
| **401** | `{ "message": "Authentication required" }` (Sprint 2) |
| **404** | `{ "message": "Category not found" }` |
| **500** | `{ "message": "An unexpected error occurred" }` |

#### [PUT] /games/:id

**Auth:** Sprint 1: No. Sprint 2: Required (own game).

**Body:** Same as POST (all optional on update, except at least one field required).

| Status | Body |
|--------|------|
| **200** | Updated game object |
| **400** | Validation / Invalid JSON |
| **401** | Authentication required (Sprint 2) |
| **403** | You can only edit your own games (Sprint 2) |
| **404** | Game not found |
| **500** | Server error |

#### [DELETE] /games/:id

**Auth:** Sprint 1: No. Sprint 2: Required (own game). Soft-delete.

| Status | Body |
|--------|------|
| **200** | `{ "data": { "id": "...", "name": "Hades", "deleted_at": "2024-01-15T12:00:00Z" } }` |
| **401** | Authentication required (Sprint 2) |
| **403** | You can only delete your own games (Sprint 2) |
| **404** | Game not found |
| **500** | Server error |

#### [PATCH] /games/:id/complete

**Auth:** Sprint 1: No. Sprint 2: Required (own game).

**Body:**
```json
{
  "status": "completed",
  "completion_notes": "Amazing ending, cried a little",
  "completion_rating": 5
}
```

| Status | Body |
|--------|------|
| **200** | `{ "data": { "id": "...", "status": "completed", "completed_at": "2024-01-15T12:00:00Z", "completion_notes": "...", "completion_rating": 5 } }` |
| **400** | Invalid status or rating out of 1-5 range |
| **401** | Authentication required (Sprint 2) |
| **403** | You can only complete your own games (Sprint 2) |
| **404** | Game not found |
| **500** | Server error |

---

### Auth (`/auth`) — Sprint 2

#### [POST] /auth/register

**Body:**
```json
{
  "alias": "NeonSlayer",
  "email": "neon@example.com",
  "password": "securePass123"
}
```

| Status | Body |
|--------|------|
| **201** | `{ "data": { "id": "01ARZ...", "alias": "NeonSlayer", "email": "neon@example.com", "role": "user", "token": "jwt_token", "created_at": "..." } }` |
| **400** | Validation error |
| **409** | `{ "message": "A user with this email already exists" }` |
| **500** | Server error |

#### [POST] /auth/login

**Body:**
```json
{
  "email": "neon@example.com",
  "password": "securePass123"
}
```

| Status | Body |
|--------|------|
| **200** | `{ "data": { "id": "...", "alias": "NeonSlayer", "email": "neon@example.com", "role": "user", "token": "jwt_token" } }` |
| **400** | Validation error |
| **401** | `{ "message": "Invalid email or password" }` |
| **500** | Server error |

---

### Users (`/users`) — Sprint 2

#### [GET] /users/me

| Status | Body |
|--------|------|
| **200** | `{ "data": { "id": "...", "alias": "NeonSlayer", "email": "neon@example.com", "role": "user", "is_active": true, "created_at": "..." } }` |
| **401** | Authentication required |

#### [PUT] /users/me

**Body:** Fields to update (alias, password). Email cannot be changed.

| Status | Body |
|--------|------|
| **200** | Updated user object |
| **400** | Validation error |
| **401** | Authentication required |

---

### Categories (`/categories`)

#### [GET] /categories

| Status | Body |
|--------|------|
| **200** | `{ "data": [ { "id": "...", "name": "RPG", "sort_order": 1, "is_active": true } ], "meta": { "pagination": { ... } } }` |
| **500** | Server error |

#### [POST] /categories

**Auth:** Admin only.

**Body:**
```json
{
  "name": "Shooter",
  "sort_order": 2,
  "is_active": true
}
```

| Status | Body |
|--------|------|
| **201** | Created category object |
| **400** | Validation error |
| **401** | Authentication required |
| **403** | Admin access required |
| **500** | Server error |

#### [PUT] /categories/:id

**Auth:** Admin only.

| Status | Body |
|--------|------|
| **200** | Updated category object |
| **400** | Validation error |
| **401/403** | Auth/Admin errors |
| **404** | Category not found |
| **500** | Server error |

#### [DELETE] /categories/:id

**Auth:** Admin only. Soft-delete.

| Status | Body |
|--------|------|
| **200** | Soft-deleted category object |
| **401/403** | Auth/Admin errors |
| **404** | Category not found |
| **500** | Server error |

---

### Tags (`/tags`)

#### [GET] /tags

| Status | Body |
|--------|------|
| **200** | `{ "data": [ { "id": "...", "name": "indie", "slug": "indie" } ], "meta": { "pagination": { ... } } }` |
| **500** | Server error |

#### [POST] /tags

**Auth:** Admin only.

**Body:**
```json
{
  "name": "Roguelike"
}
```

| Status | Body |
|--------|------|
| **201** | Created tag object |
| **400** | Validation error |
| **401** | Authentication required |
| **403** | Admin access required |
| **409** | Tag with this slug already exists |
| **500** | Server error |

#### [PUT] /tags/:id

**Auth:** Admin only.

| Status | Body |
|--------|------|
| **200** | Updated tag object |
| **400** | Validation error |
| **401/403** | Auth/Admin errors |
| **404** | Tag not found |
| **409** | Slug conflict |
| **500** | Server error |

#### [DELETE] /tags/:id

**Auth:** Admin only. Soft-delete.

| Status | Body |
|--------|------|
| **200** | Soft-deleted tag object |
| **401/403** | Auth/Admin errors |
| **404** | Tag not found |
| **500** | Server error |

---

## Design Notes

- **Dark Theme by default**: Background `#0D0D0F`, surfaces `#1A1A1F`, text `#E0E0E0`.
- **Primary color**: Fluorescent green `#39FF14` (success, priority highlights, CTAs).
- **Accent color**: Neon purple `#BF00FF` (hover states, active filters, gradients).
- **Typography Titles/UI**: [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) (retro gaming style).
- **Typography Body**: Sans-serif legible (Inter / Source Sans 3).
- **Soft-delete**: All entities use `deleted_at` for logical deletion.
- **Priority Score**: Auto-computed as `metacritic_score / hours_to_complete`. Not stored as a DB column but calculated at retrieval time or via Prisma virtual logic in the transformer layer.
- **Sprint 1**: API works without auth middleware on game routes. All games belong to the default seeded user.
- **Sprint 2**: Auth middleware activates. Games scoped to `req.userSession.id`. Admin role required for category/tag mutations.
