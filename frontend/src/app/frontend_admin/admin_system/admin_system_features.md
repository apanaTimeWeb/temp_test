# Admin System — Canonical Domain Specification

## Purpose and ownership boundary

- Canonical domain container: `frontend_admin/admin_system/`.
- User-frozen target submodules (15): `system_settings`, `system_branding`, `system_backups`, `system_smart_id`, `system_bulk_import`, `system_data_export`, `system_auto_scale`, `system_maintenance`, `system_offline`, `system_power_saving`, `system_gap_filling`, `system_waitlist_automation`, `system_whatsapp_integration`, `system_profile`, `system_audit_logs`.
- Only these listed directories are active business submodules in this domain. No pseudo-module such as `admin_system_compatibility` or `admin_system_main` is part of the frozen target.
- Root files are limited to the domain navigation shell/redirect, applicable loading/error boundaries, the documentation trio and canonical domain URL configuration. Feature implementation remains inside the listed autonomous submodules.
- Sibling submodules must not import or runtime-couple to one another; source-local WET duplication is intentional under the governing architecture contract.

## Physical route and URL contract

- Canonical domain root: `/admin/admin_system`.
- Each user-visible submodule has its own canonical route `/admin/admin_system/{submodule}`; see the registry below for the exact list.
- Legacy UI paths, aliases, and compatibility redirects are intentionally retired. This is a canonical route rebuild, not a route-preservation exercise.
- Backend API-relative paths are independent contracts and must not be rewritten solely because they resemble old browser routes. Host rewrites, authentication, backend authorization, and tenant isolation require host/backend evidence not included in this ZIP.
- Domain-level config files found in the current physical tree: none; canonical route literals are maintained by the module-local route configs.

## Autonomous submodule registry

| Submodule | Canonical UI route | Example TSX source | API service files | Test files |
|---|---|---|---:|---:|
| `system_settings` | `/admin/admin_system/system_settings` | `components/AdminSystemSettingsPageView.tsx` | 1 | 2 |
| `system_branding` | `/admin/admin_system/system_branding` | `components/AdminSystemBrandingPage.tsx` | 0 | 4 |
| `system_backups` | `/admin/admin_system/system_backups` | `components/AdminSystemBackupsPage.tsx` | 0 | 3 |
| `system_smart_id` | `/admin/admin_system/system_smart_id` | `components/AdminSystemSmartIdPage.tsx` | 0 | 2 |
| `system_bulk_import` | `/admin/admin_system/system_bulk_import` | `components/AdminSystemBulkImportPage.tsx` | 0 | 2 |
| `system_data_export` | `/admin/admin_system/system_data_export` | `components/AdminSystemDataExportPage.tsx` | 0 | 3 |
| `system_auto_scale` | `/admin/admin_system/system_auto_scale` | `components/AdminSystemAutoScalePage.tsx` | 0 | 3 |
| `system_maintenance` | `/admin/admin_system/system_maintenance` | `components/AdminSystemMaintenancePage.tsx` | 0 | 2 |
| `system_offline` | `/admin/admin_system/system_offline` | `components/AdminSystemOfflinePage.tsx` | 0 | 2 |
| `system_power_saving` | `/admin/admin_system/system_power_saving` | `components/AdminSystemPowerSavingPage.tsx` | 0 | 2 |
| `system_gap_filling` | `/admin/admin_system/system_gap_filling` | `components/AdminSystemGapFillingPage.tsx` | 0 | 2 |
| `system_waitlist_automation` | `/admin/admin_system/system_waitlist_automation` | `components/AdminSystemWaitlistAutomationPage.tsx` | 0 | 2 |
| `system_whatsapp_integration` | `/admin/admin_system/system_whatsapp_integration` | `components/AdminSystemWhatsappIntegrationPage.tsx` | 0 | 2 |
| `system_profile` | `/admin/admin_system/system_profile` | `components/AdminSystemProfilePage.tsx` | 0 | 4 |
| `system_audit_logs` | `/admin/admin_system/system_audit_logs` | `components/AdminSystemAuditLogsPage.tsx` | 1 | 3 |

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
