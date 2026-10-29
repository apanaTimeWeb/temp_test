# Navigation isolated harness

- Wrap the supplied navigation children in `ManagerNavigationNavigationHarness` to provide a fresh QueryClient and the module-local English/Hindi catalogs.
- The selector follows the exact scenario intent IDs in `manager_navigation_navigation.scenarios.ts`: `default`, `empty`, `error`, `timeout`, and `unauthorized`.
- The harness probe only reports scenario intent and the source-declared `BLOCKED_BY_SUPPLIED_CONTRACT` status. It does not fabricate routes, API payloads, authorization, or persistence behavior.
- Browser-level navigation and host integration remain `DEFERRED_TO_HOST_RUNTIME`.
