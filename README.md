# Budget Tracker

Monorepo project dengan NestJS (backend) dan NextJS (frontend).

## Prerequisites

- Node.js >= 20
- pnpm >= 10
- PostgreSQL (local atau cloud)

## Quick Start

### 1. Clone & Install

```bash
# Install dependencies
pnpm install
```

### 2. Setup Database

Buat database PostgreSQL:

```bash
# Local PostgreSQL
createdb budget_tracker
```

Atau gunakan cloud database (Neon/Supabase) dan update `.env`.

### 3. Configure Environment

```bash
# Copy environment file
cp apps/backend/.env.example apps/backend/.env

# Edit dengan credential database kamu
# Contoh untuk local:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/budget_tracker?schema=public"
```

### 4. Run Development Server

```bash
cd apps/backend
pnpm start:dev
```

Server akan running di `http://localhost:3001`

## Project Structure

```
budget-tracker/
├── apps/
│   └── backend/              # NestJS application
│       └── src/
│           ├── config/       # Environment config
│           ├── entities/    # MikroORM entities
│           ├── modules/     # Feature modules (user, auth, dll)
│           └── shared/      # Shared pipes, dll
├── packages/
│   └── zod/                  # Shared Zod schemas
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

## Available Scripts

### Root

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm build` | Build all apps |
| `pnpm dev` | Run all apps in dev mode |

### Backend

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run dev server dengan hot reload |
| `pnpm build` | Build production bundle |
| `pnpm db:create` | Create database schema (sync langsung) |
| `pnpm db:update` | Update database schema (sync langsung) |
| `pnpm db:drop` | Drop database schema |
| `pnpm migration:create` | Create new migration |
| `pnpm migration:up` | Run pending migrations |

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create new user |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |

## Tech Stack

- **Backend**: NestJS
- **ORM**: MikroORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **Package Manager**: pnpm
- **Monorepo**: Turborepo

## Contributing

1. Create new branch
2. Make changes
3. Submit PR
