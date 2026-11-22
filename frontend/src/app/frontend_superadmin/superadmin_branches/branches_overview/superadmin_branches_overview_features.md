---
module: superadmin_branches
submodule: branches_overview
title: SuperAdmin Branch Management Features
role: superadmin
status: production_ready
version: 1.0.0
---

# SuperAdmin Branch Management (Module 03) Features

## 1. Overview
SuperAdmin provides complete operational lifecycle and tenant-isolated branch management across all library organizations.

## 2. 14 SuperAdmin Controls
1. **Create Branch**: Provisions new branch under specific library account. Duplicate branch code validation enforced.
2. **Edit Branch**: Modify physical address, contact details, working hours, and weekly holidays.
3. **Activate Branch**: Mark operational status active.
4. **Temporarily Suspend**: Temporarily blocks branch access. Sibling branches remain operational.
5. **Deactivate**: Operationally inactive state.
6. **Close Branch**: Safe closure enforcing 0 unreturned physical books and ₹0 member dues.
7. **Transfer Manager**: Reassigns branch manager with required audit justification.
8. **Change Admin**: Reassigns authorized tenant admin.
9. **Change Plan**: Updates branch entitlements.
10. **View Details**: Full profile showing branch physical assets vs shared catalog.
11. **View Activity**: Complete branch-level audit logs.
12. **View Reports**: Branch-wise utilization, seat occupancy, and revenue.
13. **Export Data**: CSV, Excel (.xls), and print view.
14. **Restore**: Restores archived branches per policy.

## 3. Invariants
- No duplicate branch codes allowed across the system.
- Hard delete is strictly forbidden (soft delete & restore only).
- Branch closure requires pre-flight safety clearance (0 books, 0 dues).
