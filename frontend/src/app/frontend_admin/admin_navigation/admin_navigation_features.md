# admin_navigation — Source-Verified Navigation Support Module (V34)

> Generated from the current working tree on 2026-10-23. Paths, file counts, route constants, and submodule inventory are source-derived. This document does not claim host rewrites, backend availability, server authorization, or runtime success.

## Purpose and ownership boundary

- Domain container: `frontend_admin/admin_navigation/`.
- Autonomous submodules: **1**. All business source, mocks, tests, schemas, types, and locale catalogs are owned by a domain-prefixed terminal submodule.
- Parent root retains only permitted shell/route-entry files and the parent documentation trio. Route configuration is owned by the autonomous sidebar submodule; no executable URL-config file remains at the domain-container root.
- Sibling submodules must not import or runtime-couple to one another; local duplication is intentional under the supplied strict WET rule.

## Physical route and URL contract

- Root route/shell files: none found.
- URL config constants (exact source names and literal values):
  - Nine primary destinations are sourced from the existing `ADMIN_ROUTES` registry through `admin_navigation_sidebar/config/admin_navigation_sidebar.url_config.ts`; no destination changes were made.
- Public host rewrites are not established by this source package; verify them in the host integration. Existing query parameters, view keys, and resource IDs must remain unchanged.

## Autonomous submodule registry

| Submodule | Capability | Screen/entry files | API adapters | Tests |
|---|---|---|---:|---:|
| `admin_navigation_sidebar` | Cross-domain primary/secondary navigation shell | `admin_navigation_sidebar/page.tsx` and local components | 0 | 3 |

## Data requirements and local contracts

| Submodule | API files | Source-resolved endpoint refs | Schemas | Types | Mocks / fixtures |
|---|---:|---|---:|---:|---:|
| `admin_navigation_sidebar` | 0 | none resolved from source | 0 | 1 | 0 |

All DTOs, endpoint paths, query keys, permissions, amount units, pagination envelopes, and session behavior must remain limited to source-declared contracts. A mock handler is test/demo evidence, not proof of a live backend operation. Unknown behavior remains `BLOCKED_BY_SUPPLIED_CONTRACT`.

## Permission and security evidence

- `admin_navigation_sidebar`: 3 source files matched permission/RBAC terms; inspect its Section 7 for paths. This is not proof of server authorization.

## Component tree and canonical categories

- `admin_navigation_sidebar/`: `components/`, `types/`, `tests/`, `locales/`, `config/`, `contracts/`; current module inventory is documented in its feature specification.

## Quality and release boundary

- Each submodule has a local 22-section feature specification, specific forbidden-pattern document, and theme contract.
- Architecture checker enforces domain-root quarantine, submodule documentation, canonical child categories, local imports, and sibling isolation.
- Source tests and mocks are inventoried but are not considered passing unless executed with installed dependencies.
- Preserve current UI permission visibility, accessible controls, loading/empty/error states, locale keys, responsive behavior, and design tokens.
- Runtime/API/authentication/tenant-isolation/host rewrite behavior remains a host integration verification responsibility.

## Domain-level files

- `admin_navigation/admin_navigation_features.md`
- `admin_navigation/admin_navigation_forbidden.md`
- `admin_navigation/admin_navigation_theme_contract.md`

## Library primary navigation contract (V33)
The primary business menu is limited to Dashboard, Catalog, Circulation, Members, Staff & Access, and Reports. Profile remains self-service/avatar-owned. Gym-oriented seats, shifts, lockers, fee, subscriptions and renewal routes remain directly addressable through preserved URL constants but are not primary Library navigation. Branches, Settings, Security and Support remain conditional until role scope is verified.


## V34 scope note

This support module is not an additional business domain. The active business domain containers remain exactly the nine in `frontend_admin/`; this module provides the role navigation shell and must not be used as a dumping ground for business pages or shared business logic. The sidebar entries are derived from the canonical domain/submodule route registry.


**Current domain registry inventory (2026-10-30):** Example source paths, API-service counts and test-file counts above were refreshed from the current working tree. Each leaf module’s recursive physical inventory is recorded in the release `AUTONOMOUS_SUBMODULE_PHYSICAL_FILE_LEDGER.csv`.
