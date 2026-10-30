# Admin Application Infrastructure Boundary

This directory contains only application-wide plumbing that cannot safely or meaningfully be owned by one business feature module.

## Allowed responsibilities

- `AdminShellRoute`, the role layout wrapper, and shell-level responsive presentation.
- Global query-client provider wiring.
- Admin-wide navigation frame (header/sidebar), navigation route registry, and the single canonical application brand configuration (`AdminBrandConfig`).
- Admin shell locale strings and type definitions.
- The generic URL query-state hook for shareable search/filter/sort/pagination values; it owns no business data and preserves unrelated query parameters.
- Tests for the infrastructure above.

## Explicit exclusions

- Feature-specific business components, API clients, schemas, stores, constants, utilities, mocks, tests, or permissions. Generic application-wide URL state plumbing is the only allowed hook exception and must not contain feature-specific values.
- Generic design-system primitives. Those belong in `components/ui/`.
- Any component moved here merely because more than one feature consumes it.

## Ownership rule

A component is allowed here only when it provides stable application plumbing, has no feature-specific business behavior, is intentionally application-wide, and duplicating it per feature would cause conflicting or invalid framework behavior. Similar feature behavior may be duplicated inside its owning feature when that improves isolation.

The generic sortable/paginated `DataGrid` is a UI primitive and therefore lives under `components/ui/data-grid/`, not in this infrastructure directory.


## Locale ownership clarification (RBG9)

Shell catalogs contain only shell/navigation/provider copy. CRM, enquiries, and other business-feature messages belong to their owning feature locale catalogs; unused feature-specific keys must not be added to `ADMIN_SHELL`.


## Canonical route root constants

`application_infrastructure_constants/applicationInfrastructureAdminRouteConstants.ts` contains only canonical root-path constants needed by compatibility-only route aliases. Dedicated feature URL configs re-export the matching constant, preserving feature ownership while preventing route-literal duplication and forbidden feature-to-feature imports. Do not add feature behavior or API contracts to this file.
