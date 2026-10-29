# members_new_admission isolated harness

- Render `ManagerMembersNewAdmissionHarness` without `children` to mount the actual `ManagerMembersNewAdmissionMain` component in a fresh TanStack Query provider and the real module-owned `next-intl` English/Hindi locale catalogs. Optional `children` can override the default content for focused component tests.
- The development-only scenario selector switches MSW handlers for the private harness probe `MANAGER_MEMBERS_NEW_ADMISSION_SCENARIO_PROBE_URL` and performs a request to display the real HTTP result without a page reload.
- Available scenarios: `ACTIVE`, `EMPTY`, `SERVER_500`, `TIMEOUT`, and `UNAUTHORIZED`. The internal probe is **not** an application/backend endpoint; its response exercises harness handler selection only.
- The feature retains its existing source-backed module handlers.
- Bootstrap lifecycle is implemented by `ManagerMembersNewAdmissionHarnessBootstrap.ts`. Host setup may import `startManagerMembersNewAdmissionWorker` / `stopManagerMembersNewAdmissionWorker` for explicit lifecycle control; `setManagerMembersNewAdmissionScenario` replaces the active scenario handler without duplicating the worker.
- The browser service worker and live feature flows require the host app runtime. Those checks remain `DEFERRED_TO_HOST_RUNTIME` until executed in the host project.
