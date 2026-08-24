# Concrete Factory API

The HTTP API is served by the gateway at `http://localhost:3000` by default. Import `docs/concrete-factory.postman_collection.json` into Postman, set the `baseUrl` collection variable if needed, and run `Auth / Login` first. Its test script saves `accessToken` for the remaining requests.

## Authentication and RBAC

All endpoints except `POST /auth/login` require `Authorization: Bearer <access token>`.

The gateway checks the required `resource:action` permission before forwarding each request to the owning service. The seeded `admin` role has every permission. The development seed credentials are `admin` / `admin123`; configure `ADMIN_NAME`, `ADMIN_PASSWORD`, and `JWT_SECRET` outside development.

Every authenticated gateway request is recorded in the audit-log service. Password values are deliberately omitted from audit records.

## Endpoint Reference

| Method | Path | Permission | Request body / filters |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | `{ "name", "password" }` |
| GET | `/auth/me` | `users:read` | None |
| POST | `/auth/change-password` | `users:update` | `{ "currentPassword", "newPassword" }` |
| PATCH | `/auth/details` | `users:update` | `{ "name" }` |
| GET | `/users` | `users:read` | None |
| POST | `/users` | `users:create` | `{ "name", "password", "roleId" }` |
| GET | `/roles` | `roles:read` | None |
| GET | `/permissions` | `permissions:read` | None |
| POST | `/materials` | `materials:create` | `{ "name", "sku", "categoryId", "unitId", "reorderLevel", "isActive" }` |
| GET | `/materials` | `materials:read` | Filters: `search`, `categoryId`, `unitId`, `isActive` |
| PATCH | `/materials/:id` | `materials:update` | Any material fields |
| DELETE | `/materials/:id` | `materials:delete` | None |
| GET | `/categories` | `categories:read` | Filters: `search`, `isActive` |
| POST | `/categories` | `categories:create` | `{ "name", "code", "isActive" }` |
| GET | `/units` | `units:read` | Filters: `search`, `isActive` |
| POST | `/units` | `units:create` | `{ "name", "symbol", "isActive" }` |
| GET | `/suppliers` | `suppliers:read` | Filters: `search`, `isActive` |
| POST | `/suppliers` | `suppliers:create` | `{ "name", "code", "contactInfo", "isActive" }` |
| GET | `/stations` | `stations:read` | Filters: `search`, `isActive` |
| POST | `/stations` | `stations:create` | `{ "name", "code", "location", "isActive" }` |
| GET | `/inventory` | `inventory:read` | Filters: `materialId`, `stationId`, `belowReorder` |
| POST | `/inventory/adjustments` | `inventory:update` | `{ "materialId", "stationId", "quantity", "type", "referenceNumber", "supplierId?", "invoiceId?" }`; `type` is `incoming` or `outgoing` |
| POST | `/inventory/:id/reserve` | `inventory:update` | `{ "quantity" }` |
| GET | `/stock-movements` | `stock-movements:read` | Filters: `materialId`, `stationId`, `type` |
| POST | `/invoices` | `invoices:create` | `{ "invoiceNumber", "type", "supplierId?", "partyName", "totalAmount" }`; `type` is `purchase` or `sales` |
| GET | `/invoices` | `invoices:read` | Filters: `status`, `type`, `supplierId` |
| PATCH | `/invoices/:id` | `invoices:update` | Any invoice fields |
| POST | `/invoices/:id/issue` | `invoices:approve` | None |
| DELETE | `/invoices/:id` | `invoices:delete` | None |
| POST | `/disposals` | `disposals:create` | `{ "materialId", "stationId", "quantity", "reason?" }` |
| GET | `/disposals` | `disposals:read` | Filters: `materialId`, `stationId`, `status` |
| POST | `/disposals/:id/approve` | `disposals:approve` | `{ "status" }`; `status` is `approved` or `rejected` |
| POST | `/settlements` | `settlements:create` | `{ "materialId", "stationId", "createdById", "type", "quantity", "reason", "previousQty", "newQty" }`; `type` is `positive` or `negative` |
| GET | `/settlements` | `settlements:read` | Filters: `materialId`, `stationId` |
| GET | `/audit-logs` | `audit-logs:read` | Filters: `entityType`, `entityId`, `performedBy` |
| GET | `/analytics/stations/:stationId?month=YYYY-MM` | `analytics:read` | Required `month`; returns station details, current inventory, monthly movements, disposals, and settlements |

IDs are UUIDs for master, inventory, invoice, disposal, settlement, and audit entities. `roleId` and user IDs are numeric.

## Status Values

| Field | Values |
| --- | --- |
| `StockMovement.type` | `incoming`, `outgoing` |
| `Invoice.type` | `purchase`, `sales` |
| `Invoice.status` | `draft`, `issued`, `paid`, `cancelled` |
| `MaterialDisposal.status` | `pending`, `approved`, `rejected` |
| `Settlement.type` | `positive`, `negative` |

## Station Monthly Analytics

`GET /analytics/stations/:stationId?month=2026-08` returns data for the exact UTC calendar month.

The response contains:

- `period`: the requested month and UTC date range.
- `station`: the station record.
- `inventory`: current stock by material, including on-hand, reserved, available quantity, and reorder level.
- `movements`: incoming and outgoing movement totals plus transaction count per material for the month.
- `disposals`: disposal quantity and count grouped by status for the month.
- `settlements`: settlement quantity and count grouped by type for the month.

A missing or malformed `month` query value returns a validation error.
