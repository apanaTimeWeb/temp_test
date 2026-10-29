# Dashboard — Domain Contract

## Purpose

This directory is a quarantined Manager Library domain root. It owns the domain layout, a redirect-only root page, and this documentation trio. Feature behavior belongs to the terminal canonical leaf modules below.

## Frozen child modules

- `dashboard_overview` — `/frontend_manager/manager_dashboard/dashboard_overview`
- `dashboard_reports` — `/frontend_manager/manager_dashboard/dashboard_reports`

## Route ownership

- Root URL: `/frontend_manager/manager_dashboard`.
- Default leaf: `/frontend_manager/manager_dashboard/dashboard_overview`.
- Root `page.tsx` redirects to that canonical leaf. It must not render aggregate feature views or retain legacy query-view routing.
- Each child owns `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, its URL config, implementation, tests, and the required leaf documentation trio.
- The shared role shell lives in `frontend_manager/manager_navigation/navigation/`; the domain root must not import sibling feature implementations.

## Change control

Only the frozen children listed above may be added under this domain. Any proposed submodule change must first update the frozen scope and audit ledger; do not create nested business modules or generic shared-business buckets.
