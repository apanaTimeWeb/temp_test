# Admin Seats Shifts Lockers — Canonical Domain Specification

## Purpose and ownership boundary

- Canonical domain container: `frontend_admin/admin_seats_shifts_lockers/`.
- User-frozen target submodules (10): `seats_matrix`, `seats_management`, `seats_history`, `seats_maintenance`, `shifts_management`, `shifts_migration`, `shifts_gap`, `allocations`, `lockers_management`, `lockers_matrix`.
- Only these listed directories are active business submodules in this domain. No pseudo-module such as `admin_seats_shifts_lockers_compatibility` or `admin_seats_shifts_lockers_main` is part of the frozen target.
- Root files are limited to the domain navigation shell/redirect, applicable loading/error boundaries, the documentation trio and canonical domain URL configuration. Feature implementation remains inside the listed autonomous submodules.
- Sibling submodules must not import or runtime-couple to one another; source-local WET duplication is intentional under the governing architecture contract.

## Physical route and URL contract

- Canonical domain root: `/admin/admin_seats_shifts_lockers`.
- Each user-visible submodule has its own canonical route `/admin/admin_seats_shifts_lockers/{submodule}`; see the registry below for the exact list.
- Legacy UI paths, aliases, and compatibility redirects are intentionally retired. This is a canonical route rebuild, not a route-preservation exercise.
- Backend API-relative paths are independent contracts and must not be rewritten solely because they resemble old browser routes. Host rewrites, authentication, backend authorization, and tenant isolation require host/backend evidence not included in this ZIP.
- Domain-level config files found in the current physical tree: none; canonical route literals are maintained by the module-local route configs.

## Autonomous submodule registry

| Submodule | Canonical UI route | Example TSX source | API service files | Test files |
|---|---|---|---:|---:|
| `seats_matrix` | `/admin/admin_seats_shifts_lockers/seats_matrix` | `components/AdminSeatsMatrixPage.tsx` | 1 | 2 |
| `seats_management` | `/admin/admin_seats_shifts_lockers/seats_management` | `components/AdminSeatsManagementPage.tsx` | 0 | 2 |
| `seats_history` | `/admin/admin_seats_shifts_lockers/seats_history` | `components/AdminSeatsHistorySeatHistoryPage.tsx` | 0 | 2 |
| `seats_maintenance` | `/admin/admin_seats_shifts_lockers/seats_maintenance` | `components/AdminSeatsMaintenanceSeatManagementMaintenancePage.tsx` | 0 | 2 |
| `shifts_management` | `/admin/admin_seats_shifts_lockers/shifts_management` | `components/AdminShiftsManagementPage.tsx` | 0 | 5 |
| `shifts_migration` | `/admin/admin_seats_shifts_lockers/shifts_migration` | `components/AdminShiftsMigrationShiftMigrationPage.tsx` | 0 | 2 |
| `shifts_gap` | `/admin/admin_seats_shifts_lockers/shifts_gap` | `components/AdminShiftsGapShiftGapPage.tsx` | 0 | 2 |
| `allocations` | `/admin/admin_seats_shifts_lockers/allocations` | `components/AdminAllocationsPage.tsx` | 0 | 2 |
| `lockers_management` | `/admin/admin_seats_shifts_lockers/lockers_management` | `components/AdminLockersManagementPage.tsx` | 0 | 3 |
| `lockers_matrix` | `/admin/admin_seats_shifts_lockers/lockers_matrix` | `components/AdminLockersMatrixLockerMatrixPage.tsx` | 1 | 3 |

## Source and contract boundaries

- Per-submodule feature, forbidden-pattern, and theme-contract documents are the authority for the source-local module details.
- API endpoints and fields are considered verified only when evidenced by API client calls, Zod schemas/types, fixtures/handlers or an explicit contract. Do not infer backend support from route labels or mocks.
- Permission visibility in frontend code is not proof of server-side enforcement.
- Host runtime checks are separate from static source checks and must be reported as `DEFERRED_TO_HOST_RUNTIME` when the host/test runner is unavailable.

## Release and change control

- The current rebuild uses the 9-domain/66-submodule target frozen from the user-approved inventory.
- Do not reintroduce legacy UI routes or aliases. Preserve source-backed user flows by moving their UI, API adapters, schemas, tests, mocks and locale files into the correct target leaf.
- Final release claims must be based on the V34 Section 43P sweep and pre-delivery cross-check tables, not on historical reports or visual inspection alone.


**Current domain registry inventory (2026-10-30):** Example source paths, API-service counts and test-file counts above were refreshed from the current working tree. Each leaf module’s recursive physical inventory is recorded in the release `AUTONOMOUS_SUBMODULE_PHYSICAL_FILE_LEDGER.csv`.
