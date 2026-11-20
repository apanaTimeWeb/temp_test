# Superadmin Analytics Platform Reports — Forbidden Patterns

## STRICT BOUNDARIES & WET DIRECTIVES

1. **Zero Cross-Sub-Module Imports:**
   - Do NOT import from sibling sub-modules (e.g. `analytics_financials`, `analytics_billing_reports`, `analytics_usage_reports`, `analytics_security_reports`).
   - All components, hooks, types, constants, schemas, formatters, and fixtures MUST remain self-contained.

2. **Zero Parent Shared Business Folders:**
   - Do NOT create `superadmin_analytics/common/` or `superadmin_analytics/shared/`.
   - Any reusable formatters or table definitions must be duplicated locally under the Strict WET Principle.

3. **Zero Raw Browser Alerts:**
   - `window.alert()` and `window.confirm()` are STRICTLY FORBIDDEN.
   - Use luxury modals and sonner toasts with deterministic `id` properties.

4. **Zero Hardcoded Colors:**
   - Do not use arbitrary hex (`#`), `rgb()`, or raw Tailwind colors like `bg-blue-600`.
   - Use semantic Tailwind CSS tokens: `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, etc.

5. **Zero Barrel Files:**
   - `index.ts` files are STRICTLY FORBIDDEN.
   - All imports must be direct absolute paths (`@/...`).
