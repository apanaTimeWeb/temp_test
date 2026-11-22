# Superadmin Data, Backup & Disaster Recovery — Master Domain Forbidden Patterns

## 1. Zero Cross-Sub-Module Imports
- `data_overview/` MUST NEVER import from `data_backup_operations/`, `data_restore_operations/`, etc.
- `data_backup_operations/` MUST NEVER import from `data_restore_operations/`.
- Sibling sub-modules communicate strictly via URL navigation and typed query parameters.

## 2. Parent Shared Business Folders Prohibited
- Creating `superadmin_data/common/` or `superadmin_data/shared/` or `superadmin_data/components/` is STRICTLY FORBIDDEN.
- All business components, hooks, stores, constants, utilities, and mocks MUST live inside autonomous sub-modules (`{domain}_{capability}/`).

## 3. Strict WET Principle
- Badges, status pills, table headers, formatters, and types are duplicated locally within each sub-module.

## 4. Multi-Tenant Data Isolation
- Backups and restores for one tenant MUST NEVER alter or bleed into another tenant's partition.
- Cross-tenant data leaks in exports or migrations are strictly classified as P0 Security Violations.

## 5. Destructive Action Safety
- Single-click restore or purge operations are FORBIDDEN. All destructive actions require `useConfirm` modal with explicit type-to-confirm verification.

## 6. Zero Business State in Browser Storage
- `localStorage` and `sessionStorage` are strictly restricted to UI preferences; domain entity data MUST NEVER be persisted in browser storage.
