# Staff Payroll — Forbidden Architectural Patterns

1. **NO Single-Click Disbursal**:
   - Double-verification confirmation dialog is mandatory for salary disbursal per rule 43P-ARCH-3615.
2. **NO Cross-Submodule Imports**:
   - MUST NOT import internal schemas, hooks, or components from sibling submodules (`staff_directory`, `staff_attendance`, `staff_roles_permissions`).
3. **NO Sub-Submodule Nesting**:
   - Modals, drawers, and salary slips live inside `components/`, never in nested sub-submodule folders.
4. **NO Hardcoded Currency / Colors**:
   - All monetary amounts use standard rupee formatting (`₹`).
   - Only semantic design tokens (`bg-card`, `text-primary`, `border-border`, etc.) allowed.

