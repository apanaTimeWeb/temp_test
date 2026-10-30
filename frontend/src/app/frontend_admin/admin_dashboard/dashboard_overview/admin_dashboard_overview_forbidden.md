# admin_dashboard_dashboard_overview — Forbidden Patterns

## Allowed dependency boundary
- The leaf may import its own code, React/Next.js primitives, `lucide-react`, `next-intl`, and the centrally approved UI route registry.
- Sibling submodules must not be imported or runtime-coupled to.

## Prohibitions
- Do not invent API endpoints, data DTOs, KPI totals, permissions, or backend behavior; this screen currently makes no API request.
- Do not create fake success metrics or static business records to make the overview appear populated.
- Do not link to retired/out-of-target Catalog or Circulation routes from the active overview.
- Do not recreate aliases or redirects for retired legacy module URLs. The canonical `/admin/admin_dashboard/dashboard_overview` route is active and must resolve directly to this leaf.
- Do not import sibling business components/API clients/stores; use the central route registry for navigation constants.
- Do not hardcode visible user-facing text outside the `ADMIN_DASHBOARD` locale namespace.
- Do not add raw color values or break semantic focus and status styles.
- Do not remove the pending-metrics disclosure or accessible semantic structure.
- Do not log PII, credentials, access tokens, or secrets.

## Route taxonomy
The physical leaf folder is exactly `dashboard_overview`; internal source files and docs use the full `AdminDashboardOverview` / `admin_dashboard_dashboard_overview` prefix.
