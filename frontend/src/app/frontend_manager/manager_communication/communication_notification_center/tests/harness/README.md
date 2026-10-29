# communication_notification_center isolated harness

- Render `ManagerCommunicationNotificationCenterHarness` without `children` to mount the actual `ManagerCommunicationNotificationCenterMain` component in a fresh TanStack Query provider and the real module-owned `next-intl` English/Hindi locale catalogs. Optional `children` can override the default content for focused component tests.
- The development-only scenario selector switches MSW handlers for the private harness probe `MANAGER_COMMUNICATION_NOTIFICATION_CENTER_SCENARIO_PROBE_URL` and performs a request to display the real HTTP result without a page reload.
- Available scenarios: `ACTIVE`, `EMPTY`, `SERVER_500`, `TIMEOUT`, and `UNAUTHORIZED`. The internal probe is **not** an application/backend endpoint; its response exercises harness handler selection only.
- The module’s currently empty/no-contract business handler list remains empty; no feature endpoint, response schema, authentication rule, or persistence behavior is invented.
- Bootstrap lifecycle is implemented by `ManagerCommunicationNotificationCenterHarnessBootstrap.ts`. Host setup may import `startManagerCommunicationNotificationCenterWorker` / `stopManagerCommunicationNotificationCenterWorker` for explicit lifecycle control; `setManagerCommunicationNotificationCenterScenario` replaces the active scenario handler without duplicating the worker.
- The browser service worker and live feature flows require the host app runtime. Those checks remain `DEFERRED_TO_HOST_RUNTIME` until executed in the host project.
