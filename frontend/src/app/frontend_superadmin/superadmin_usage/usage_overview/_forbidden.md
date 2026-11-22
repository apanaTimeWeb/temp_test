# Superadmin Usage Overview - Forbidden Rules

1. **NO Cross-Submodule Imports**: Never import directly from `usage_quota_requests`, `superadmin_branches`, or any sibling sub-module. Maintain full Tier 4 self-containment.
2. **NO Hardcoded Hex Colors**: All styling must utilize semantic Tailwind tokens (`bg-card`, `text-primary`, `border-border`, `text-slate-400`).
3. **NO Component Files Over 300 Lines**: Every `.tsx` file must adhere strictly to `< 300 lines`.
4. **NO Custom Hook Files Over 150 Lines**: Every custom hook must adhere strictly to `< 150 lines`.
5. **NO Silent Overage Charges**: Quota overages must visibly block actions and trigger expansion requests; never automatically trigger silent billing.
6. **NO Window Alert or Confirm**: Always use modern modal dialogs or toasts.
