---
module: superadmin_branches
submodule: branches_overview
title: SuperAdmin Branch Management Forbidden Behaviors
role: superadmin
status: normative
---

# Forbidden Patterns & Behaviors

1. **Hard Delete Prohibited**: Physical deletion of branch records from database or UI is strictly forbidden. Use soft closure / archival.
2. **Cascading Branch Suspension Prohibited**: Suspending one branch MUST NOT automatically suspend sibling branches belonging to the same library unless explicitly requested by tenant-level suspension policy.
3. **Closing with Outstanding Assets Prohibited**: A branch with >0 unreturned books or >₹0 member dues cannot be closed without prior reconciliation.
4. **Duplicate Codes Prohibited**: Branch codes must be unique system-wide.
5. **Cross-Tenant Accidental Reassignment Prohibited**: A branch must remain strictly scoped to its owning Library Account.
