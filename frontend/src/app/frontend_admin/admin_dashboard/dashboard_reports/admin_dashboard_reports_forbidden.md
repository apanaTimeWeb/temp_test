# Admin Dashboard Reports — Forbidden Patterns

- **Retired route aliases:** Do not create or link `/admin/admin_reports`, `/admin/admin_dashboard/dashboard_reports/admin_reports_main`, or any compatibility alias for the retired report route.
- **Nested capability folders:** Do not recreate folders such as `admin_reports_components_main/`; code belongs in the autonomous submodule's canonical category folders.
- **Sibling submodules:** Do not import business components, hooks, mocks, state, types, or utilities from sibling submodules. Similar business UI must be locally owned under the strict WET boundary.
- **Unverified live DTO:** Do not treat the generic `GET /api/v1/admin/reports` record schema as proof that revenue, expense, student growth, occupancy, branch, currency, or aggregation fields exist. Those live fields are `CONTRACT_MISSING`.
- **Demo-mode isolation:** Do not render sample analytics outside `isFrontendDemoModeEnabled()`. Never label fixtures as live data.
- **Catalog export integrity:** Do not export sample or assumed production metrics from the Report library. Its export is catalog metadata only; demo analytics export is explicitly named a demo snapshot.
- **Out-of-scope categories:** Do not add catalog/circulation report categories unless target Admin scope and backend contract are explicitly expanded.
- **Design-token compliance:** Do not use raw hex/RGB styling, inline styles, arbitrary Tailwind CSS-variable classes, unapproved opacity modifiers, browser alerts, or non-semantic colors where global tokens apply.
- **Evidence-based claims:** Do not claim backend authorization, tenant isolation, report freshness, runtime correctness, or test passes without matching evidence.
- **Feature preservation:** Do not remove partially implemented in-scope report UI to silence type/test errors; complete or explicitly document the external contract gap.
