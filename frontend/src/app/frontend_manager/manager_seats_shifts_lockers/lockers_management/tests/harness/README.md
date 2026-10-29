# manager_lockers_management isolated harness

- Import `ManagerLockersManagementHarness` to provide a fresh TanStack Query client, real English/Hindi locale messages, and a selectable read-only `ACTIVE` or `EMPTY` MSW scenario.
- Node/Vitest suites may import `./ManagerLockersManagementHarnessBootstrap` to install and clean up the module-owned MSW server. The bootstrap file is colocated in this folder.
- `SERVER_500`, `TIMEOUT`, and `UNAUTHORIZED` are displayed as disabled host-only scenarios until verified host error/auth contracts are supplied; the harness does not simulate or claim those external contracts.
- Existing read handlers cover only the module's verified GET URLs. No allocation, migration, assignment, persistence, tenant or authentication write contract is invented.
- Browser execution and host provider compatibility remain `DEFERRED_TO_HOST_RUNTIME`.
