# Seats Shifts Lockers — Domain Contract

## Purpose

This directory is a quarantined Manager Library domain root. It owns the domain layout, a redirect-only root page, and this documentation trio. Feature behavior belongs to the terminal canonical leaf modules below.

## Frozen child modules

- `seats_matrix` — `/frontend_manager/manager_seats_shifts_lockers/seats_matrix`
- `seats_management` — `/frontend_manager/manager_seats_shifts_lockers/seats_management`
- `shifts_management` — `/frontend_manager/manager_seats_shifts_lockers/shifts_management`
- `shifts_migration` — `/frontend_manager/manager_seats_shifts_lockers/shifts_migration`
- `seats_allocations` — `/frontend_manager/manager_seats_shifts_lockers/seats_allocations`
- `seats_history` — `/frontend_manager/manager_seats_shifts_lockers/seats_history`
- `lockers_management` — `/frontend_manager/manager_seats_shifts_lockers/lockers_management`
- `lockers_matrix` — `/frontend_manager/manager_seats_shifts_lockers/lockers_matrix`

## Route ownership

- Root URL: `/frontend_manager/manager_seats_shifts_lockers`.
- Default leaf: `/frontend_manager/manager_seats_shifts_lockers/seats_matrix`.
- Root `page.tsx` redirects to that canonical leaf. It must not render aggregate feature views or retain legacy query-view routing.
- Each child owns `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, its URL config, implementation, tests, and the required leaf documentation trio.
- The shared role shell lives in `frontend_manager/manager_navigation/navigation/`; the domain root must not import sibling feature implementations.

## Change control

Only the frozen children listed above may be added under this domain. Any proposed submodule change must first update the frozen scope and audit ledger; do not create nested business modules or generic shared-business buckets.
