# Superadmin Usage Quota Requests - Forbidden Rules

1. **NO Cross-Submodule Imports**: Never import directly from `usage_overview`, `superadmin_branches`, or any sibling sub-module. Maintain full Tier 4 self-containment.
2. **NO Hardcoded Hex Colors**: All styling must utilize semantic Tailwind tokens (`bg-card`, `text-primary`, `border-border`, `text-slate-400`).
3. **NO Component Files Over 300 Lines**: Every `.tsx` file must adhere strictly to `< 300 lines`.
4. **NO Custom Hook Files Over 150 Lines**: Every custom hook must adhere strictly to `< 150 lines`.
5. **NO Unjustified Rejections**: Rejection reasons must be mandatory (minimum 5 characters).
6. **NO Window Alert or Confirm**: Always use modern modal dialogs or toasts.
