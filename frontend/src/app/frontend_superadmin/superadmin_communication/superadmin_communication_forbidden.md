# superadmin_communication — Forbidden Imports and Boundaries

- Do not import business components, hooks, stores, schemas, fixtures, or utilities directly from sibling leaf submodules.
- Do not introduce `superadmin_communication/common/`, `superadmin_communication/shared/`, `misc/`, or a nested business submodule.
- Do not invent external API endpoints, response fields, permission names, persistence behavior, or tenant scope.
- Do not remove or disable existing features to simplify the folder tree.
- Do not treat a UI preview/mock as evidence of live persistence.
- Keep role/tenant/branch identifiers sourced from the verified auth contract; do not trust body fields for authorization.
- Keep each leaf's `features.md`, `forbidden.md`, and `theme_contract.md` co-located and consistent with its renamed route.
- Any unresolved conflict in the supplied sources must be recorded as `SOURCE_CONFLICT`; missing external details must be recorded as `BLOCKED_BY_SUPPLIED_SCOPE`.

## Leaf boundary

`communication_notices`, `communication_notification_center`, `communication_whatsapp_integration`, `communication_whatsapp_logs`, `communication_whatsapp_templates`
