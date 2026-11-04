# Staff Attendance — Forbidden Architectural Patterns

1. **NO Cross-Submodule Imports**:
   - MUST NOT import internal components, schemas, or hooks from `staff_directory` or `staff_roles_permissions`.
2. **NO Sub-Submodule Nesting**:
   - Sub-screens live in `components/`, never in sub-folders like `staff_attendance/roster/`.
3. **NO Hardcoded HEX or Non-Semantic Colors**:
   - Only semantic design tokens (`bg-card`, `text-primary`, `border-border`, etc.) allowed.
4. **NO Student Attendance Cross-Over**:
   - This submodule is strictly for library staff (managers, attendants, cleaners, security). Student desk attendance belongs to `manager_attendance`.

