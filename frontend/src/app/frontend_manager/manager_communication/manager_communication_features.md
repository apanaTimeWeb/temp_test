# Communication — Domain Contract

## Purpose

This directory is a quarantined Manager Library domain root. It owns the domain layout, a redirect-only root page, and this documentation trio. Feature behavior belongs to the terminal canonical leaf modules below.

## Frozen child modules

- `communication_notices` — `/frontend_manager/manager_communication/communication_notices`
- `communication_complaints` — `/frontend_manager/manager_communication/communication_complaints`
- `communication_notification_center` — `/frontend_manager/manager_communication/communication_notification_center`
- `communication_whatsapp_templates` — `/frontend_manager/manager_communication/communication_whatsapp_templates`
- `communication_whatsapp_logs` — `/frontend_manager/manager_communication/communication_whatsapp_logs`

## Route ownership

- Root URL: `/frontend_manager/manager_communication`.
- Default leaf: `/frontend_manager/manager_communication/communication_notices`.
- Root `page.tsx` redirects to that canonical leaf. It must not render aggregate feature views or retain legacy query-view routing.
- Each child owns `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, its URL config, implementation, tests, and the required leaf documentation trio.
- The shared role shell lives in `frontend_manager/manager_navigation/navigation/`; the domain root must not import sibling feature implementations.

## Change control

Only the frozen children listed above may be added under this domain. Any proposed submodule change must first update the frozen scope and audit ledger; do not create nested business modules or generic shared-business buckets.
