# Accounts Assets — Domain Contract

## Purpose

This directory is a quarantined Manager Library domain root. It owns the domain layout, a redirect-only root page, and this documentation trio. Feature behavior belongs to the terminal canonical leaf modules below.

## Frozen child modules

- `accounts_expenses` — `/frontend_manager/manager_accounts_assets/accounts_expenses`
- `accounts_daily_settlement` — `/frontend_manager/manager_accounts_assets/accounts_daily_settlement`
- `accounts_seat_gap_report` — `/frontend_manager/manager_accounts_assets/accounts_seat_gap_report`
- `assets_register` — `/frontend_manager/manager_accounts_assets/assets_register`
- `assets_maintenance` — `/frontend_manager/manager_accounts_assets/assets_maintenance`

## Route ownership

- Root URL: `/frontend_manager/manager_accounts_assets`.
- Default leaf: `/frontend_manager/manager_accounts_assets/accounts_expenses`.
- Root `page.tsx` redirects to that canonical leaf. It must not render aggregate feature views or retain legacy query-view routing.
- Each child owns `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, its URL config, implementation, tests, and the required leaf documentation trio.
- The shared role shell lives in `frontend_manager/manager_navigation/navigation/`; the domain root must not import sibling feature implementations.

## Change control

Only the frozen children listed above may be added under this domain. Any proposed submodule change must first update the frozen scope and audit ledger; do not create nested business modules or generic shared-business buckets.
