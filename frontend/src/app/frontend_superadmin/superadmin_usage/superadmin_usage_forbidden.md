# Superadmin Usage — Forbidden Patterns & Domain Isolation Rules

1. **Zero Cross-Submodule Coupling:**
   - `usage_overview/` MUST NOT import components, hooks, stores, or schemas from `usage_quota_requests/`.
   - `usage_quota_requests/` MUST NOT import internal components or state from `usage_overview/`.
   - Communication between sub-modules is strictly via URL navigation and search parameters (`?libraryId=`, `?status=`).

2. **Zero Parent Shared Folder:**
   - No `superadmin_usage/common/`, `superadmin_usage/components/`, or `superadmin_usage/utils/`.
   - All executable business code lives strictly inside autonomous sub-modules (`usage_overview/`, `usage_quota_requests/`).

3. **Zero Silent Extra Billing:**
   - Never implement automatic hidden debit or overage billing without explicit SuperAdmin approval. Hard stop or transparent notification is mandatory.

4. **Zero Inline Magic Colors:**
   - All colors must map to semantic theme tokens or approved Tailwind classes. No unmapped hex strings in JSX.
