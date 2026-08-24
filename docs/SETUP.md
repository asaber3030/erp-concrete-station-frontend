# Concrete Factory API Setup

This project is a NestJS monorepo with one HTTP gateway and seven TCP microservices. The gateway exposes the public API and forwards work to the internal services.

## Services

| App | Default port | Protocol | Purpose |
| --- | ---: | --- | --- |
| `gateway` | `3000` | HTTP | Public API, RBAC guard, audit interceptor |
| `auth` | `3001` | TCP | Login, user profile, users, roles, permissions, seed data |
| `master` | `3002` | TCP | Materials, categories, units, suppliers, stations |
| `inventory` | `3003` | TCP | Inventory balances, adjustments, reservations, stock movements |
| `invoicing` | `3004` | TCP | Purchase and sales invoices |
| `audit-log` | `3005` | TCP | Activity log persistence and filtering |
| `disposal` | `3006` | TCP | Material disposals and settlements |
| `analytics` | `3007` | TCP | Monthly station analytics |

## Environment

Create a local `.env` file with the database URL, JWT secret, optional seed admin values, and optional port overrides:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/concrete_factory
JWT_SECRET=replace-with-a-strong-secret
ADMIN_NAME=admin
ADMIN_PASSWORD=admin123

AUTH_PORT=3001
MASTER_PORT=3002
INVENTORY_PORT=3003
INVOICING_PORT=3004
AUDIT_LOG_PORT=3005
DISPOSAL_PORT=3006
ANALYTICS_PORT=3007
```

The gateway currently reads its HTTP port from `process.env.port` and falls back to `3000`.

## Running Locally

Install dependencies:

```bash
npm install
```

Start every app in watch mode:

```bash
npm run start:all
```

Or start an individual app:

```bash
npm run start:gateway
npm run start:auth
npm run start:master
npm run start:inventory
npm run start:invoicing
npm run start:disposal
npm run start:analytics
npm run start:audit-log
```

Build all apps:

```bash
npm run build
```

Run unit tests:

```bash
npm run test
```

## Database Notes

All services use the same `DATABASE_URL`. TypeORM `synchronize` is enabled unless `NODE_ENV=production`, so local schemas are created or updated automatically during development.

On auth service startup, the authorization seed creates:

- Resource rows for every RBAC resource.
- `create`, `read`, `update`, `delete`, and `approve` permissions for every resource.
- An `admin` role with all permissions.
- A default admin user from `ADMIN_NAME` and `ADMIN_PASSWORD`, or `admin` / `admin123` when those variables are not set.

## Postman

Import `docs/concrete-factory.postman_collection.json`, then run `Auth / Login`. The login request stores the returned `accessToken` as a collection variable. Set the other UUID variables after creating master and operational records.

Recommended creation order for a clean database:

1. Create category.
2. Create unit.
3. Create supplier.
4. Create station.
5. Create material using the category and unit IDs.
6. Create inventory adjustment using the material and station IDs.
7. Use invoice, disposal, settlement, and analytics requests as needed.
