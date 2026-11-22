---
feature: "superadmin_integrations_overview"
owner_role: "superadmin"
module_version: 1
api_contract_source: "verified-api-contract"
last_verified_date: "2026-11-21"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "8/8"
---

# SuperAdmin Integrations Overview — Feature Map (ALL 22 CANONICAL SECTIONS)

## 1. Scope and Non-Scope (Module Purpose, System Context & Dependencies)
The SuperAdmin Integrations & API Management module is the central command center for all external service integrations, third-party communication providers, cloud file storage, hardware scanners/printers, and machine-to-machine developer API access. SuperAdmins use this module to configure credentials and sandbox/production environments for payment gateways (Razorpay, Stripe), SMS providers (MSG91, Twilio), WhatsApp Business Cloud API, Email/SMTP mailers, AWS S3 storage buckets, dynamic barcode/QR engines, and eSSL/ZKTeco biometric push synchronization. It also manages webhook event subscriptions, failed delivery retries with exponential backoff, cryptographic HMAC signing secrets, hashed API keys, global RPM rate limits, IP allowlist firewalls, live diagnostic audit logs, and tier-based plan entitlements.

### Feature Ownership & System Context
- **Feature / Role Owner:** SuperAdmin / Platform Engineering & DevOps
- **Backend Microservice / API Base:** `integrations-service` (`/api/v1/superadmin/integrations`)
- **Authoritative Database Tables:** `integration_gateways`, `webhook_endpoints`, `webhook_retries`, `api_keys`, `rate_limit_policies`, `integration_audit_logs`, `plan_entitlements`
- **Background / Queued Jobs:** `webhook_dispatch_queue`, `webhook_retry_backoff_worker`, `biometric_punch_sync_daemon`, `api_usage_rollover_cron`

### Dependency Manifest
- **State Pattern:** TanStack Query v5 (server state) + Zustand (UI state) + URL search parameters (`?tab=`)
- **Form & Validation:** React Hook Form v7 + Zod schemas
- **Icons & Primitives:** Lucide React + headless primitives

### Autonomous Sub-Module Directory Structure
| Folder | Responsibility | Key Files |
|---|---|---|
| `components/` | Provider grid, config modal, webhooks panel, API keys panel, logs, entitlements | `SuperadminIntegrationsOverviewMain.tsx`, `SuperadminIntegrationsOverviewGatewayGrid.tsx` |
| `hooks/` | Queries, URL sync, mutations with idempotency, double-verification confirm | `useSuperadminIntegrationsOverview.ts`, `useSuperadminIntegrationsOverviewMutations.ts` |
| `api/` | Typed API clients, query key factory | `superadmin_integrations_overview.api.ts`, `superadmin_integrations_overview.query_keys.ts` |
| `state/` | Zustand store for client UI state (active tab, search, modal state) | `useSuperadminIntegrationsOverviewStore.ts` |
| `types/` & `schemas/` | DTOs, interfaces, and runtime Zod validation schemas | `superadmin_integrations_overview.types.ts`, `superadmin_integrations_overview.schemas.ts` |
| `constants/` | Provider categories, default limits, event catalog | `superadmin_integrations_overview.constants.ts` |
| `locales/` | Co-located locale files (English & Hindi) | `superadmin_integrations_overview_en.json`, `superadmin_integrations_overview_hi.json` |
| `mocks/` | Mock fixtures, MSW handlers, and 5 canonical scenarios | `superadmin_integrations_overview.fixtures.ts`, `superadmin_integrations_overview.handlers.ts` |
| `tests/` | Unit, component tests and standalone mounting harness | `superadmin_integrations_overview.integration.test.tsx`, `SuperadminIntegrationsOverviewHarness.tsx` |

### Approved External Dependencies & Expected Host Contract
- `@/lib/api` — `apiFetch<T>(endpoint: string, options?: ApiFetchOptions): Promise<ApiResponse<T>>`, `createIdempotencyKey()`
- `@/lib/logger` — `logger.info`, `logger.error`
- `@/components/ui/dialog` — zero-business-logic modal primitives
- Host Session Context — `interface ExpectedAuthUser { id: string; role: 'SUPERADMIN'; tenantId: string; }`

## 2. Screen Inventory & Component Responsibility Map

| Feature / Screen | Route | What the User Can Do | Key Components | Main API Calls | Status |
|---|---|---|---|---|---|
| Provider Gateways Hub | `?tab=gateways` | View, search, toggle, and configure credentials for all 7 integration categories | `SuperadminIntegrationsOverviewGatewayGrid.tsx`, `SuperadminIntegrationsOverviewGatewayCard.tsx` | `fetchIntegrationGateways()`, `toggleIntegrationGateway()` | Complete |
| Gateway Config Modal | Inline modal | Edit credentials, toggle Sandbox/Production, and test live connection | `SuperadminIntegrationsOverviewGatewayConfigModal.tsx` | `updateIntegrationGateway()`, `testIntegrationGatewayPing()` | Complete |
| Webhooks & Retries | `?tab=webhooks` | Register endpoints, pick events, view failed retries, and trigger immediate redelivery | `SuperadminIntegrationsOverviewWebhooksPanel.tsx` | `fetchWebhookEndpoints()`, `createWebhookEndpoint()`, `triggerWebhookRetry()` | Complete |
| API Keys & Rate Limits | `?tab=api-keys` | Generate keys, view masked credentials, rotate/revoke keys, configure RPM quotas & IP firewall | `SuperadminIntegrationsOverviewApiKeysPanel.tsx` | `fetchApiKeys()`, `createApiKey()`, `rotateApiKey()`, `revokeApiKey()`, `updateRateLimits()` | Complete |
| Live Diagnostic Logs | `?tab=logs` | Live searchable log stream with latency badges, status codes, and JSON payload inspector | `SuperadminIntegrationsOverviewLogsPanel.tsx` | `fetchIntegrationLogs()` | Complete |
| Plan Entitlements | `?tab=entitlements` | Enable or disable provider access matrix across subscription tiers | `SuperadminIntegrationsOverviewEntitlementsPanel.tsx` | `fetchPlanEntitlements()`, `updatePlanEntitlement()` | Complete |

### Component Responsibility Map
- `SuperadminIntegrationsOverviewMain.tsx`: Root client orchestrator. Assembles header, KPI summary statistics, secondary tab navigation, active tab panel, and modals.
- `SuperadminIntegrationsOverviewScreen.tsx`: Thin client route adapter exported for `page.tsx`.
- `SuperadminIntegrationsOverviewGatewayGrid.tsx`: Category selector pills, debounced search, and responsive gateway card grid.
- `SuperadminIntegrationsOverviewGatewayCard.tsx`: Individual gateway card with status, toggle switch, and ping button.
- `SuperadminIntegrationsOverviewGatewayConfigModal.tsx`: Secure credential update form and test ping trigger.
- `SuperadminIntegrationsOverviewWebhooksPanel.tsx`: Webhook endpoint registration listing, test ping, and dead-letter retry queue.
- `SuperadminIntegrationsOverviewWebhookCreateModal.tsx`: Dedicated modal form for registering new HTTPS webhook endpoints and selecting event subscriptions.
- `SuperadminIntegrationsOverviewApiKeysPanel.tsx`: API key coordinator managing the list of keys, key generation, secret revelation, and rate limiting policies.
- `SuperadminIntegrationsOverviewApiKeyCard.tsx`: Individual API key row with masked key, status pill, role scope, IP allowlist chips, copy, rotate, and revoke actions.
- `SuperadminIntegrationsOverviewApiKeyGenerateModal.tsx`: Form modal to create a new machine API key with custom name, role scope, RPM, and IP allowlist.
- `SuperadminIntegrationsOverviewApiKeySecretModal.tsx`: One-time reveal modal for newly created plain-text API secrets with copy CTA.
- `SuperadminIntegrationsOverviewRateLimitForm.tsx`: Form to configure global RPM limits, daily quotas, burst buffer capacity, and global IP firewall allowlist.
- `SuperadminIntegrationsOverviewLogsPanel.tsx`: Searchable audit log table and payload inspector modal.
- `SuperadminIntegrationsOverviewEntitlementsPanel.tsx`: Subscription tier provider access toggle matrix.
- `SuperadminIntegrationsOverviewListSkeleton.tsx`: Premium skeleton loader mimicking header, KPIs, and card grid.
- `SuperadminIntegrationsOverviewEmptyState.tsx`: Branded empty state with reset filter CTA.
- `SuperadminIntegrationsOverviewErrorFallback.tsx`: Error boundary fallback with retry CTA.

## 3. Navigation Contract & User Flows

### Flow 1: Configure Gateway Credentials & Test Live Ping
1. SuperAdmin navigates to `/superadmin/superadmin_integrations/integrations_overview?tab=gateways`.
2. SuperAdmin filters by category (e.g. "Payment Gateways") or searches for "Razorpay".
3. Clicks "Configure" on the Razorpay card. `SuperadminIntegrationsOverviewGatewayConfigModal` opens.
4. User selects "Production" or "Sandbox", inputs `keyId` and `keySecret`, and clicks "Test Ping".
5. `testIntegrationGatewayPing(id)` executes with an `Idempotency-Key` and surfaces latency feedback.
6. Clicks "Save Config". `updateIntegrationGateway(id, payload)` mutates credentials, invalidates query cache, closes modal, and triggers a success toast.

### Flow 2: Webhook Endpoint Registration & Retrying Failed Deliveries
1. SuperAdmin selects "Webhooks" tab.
2. Clicks "Add Webhook Endpoint". Modal opens.
3. User enters target HTTPS URL, description, and checks subscribed events (`tenant.created`, `payment.success`).
4. On submit, `createWebhookEndpoint(payload)` registers endpoint with auto-generated HMAC secret.
5. In the "Failed Webhook Retries" section below, user views failed deliveries (e.g. 504 Gateway Timeout).
6. Clicks "Retry Delivery Now". `triggerWebhookRetry(deliveryId)` fires with `Idempotency-Key`, re-delivers event, and updates status.

### Flow 3: Secure API Key Generation & Revocation
1. SuperAdmin selects "API Keys" tab.
2. Clicks "Generate API Key". Enters key name, role scope, and RPM limit.
3. On generation, server returns plain-text secret **EXACTLY ONCE**.
4. The 1-time view modal opens with warning: "Save this key now. It will never be shown again."
5. User copies secret and confirms.
6. To revoke a key, user clicks "Revoke". Accessible `useConfirm()` dialog appears. On confirmation, key is immediately suspended.

## 4. API Contract & UI Data Requirements

| Function | Method | Endpoint | Request | Response Data Type |
|---|---|---|---|---|
| `fetchIntegrationSummary()` | GET | `/api/v1/superadmin/integrations/summary` | — | `IntegrationSummaryStats` |
| `fetchIntegrationGateways()` | GET | `/api/v1/superadmin/integrations/gateways` | — | `IntegrationGatewayItem[]` |
| `updateIntegrationGateway(id, payload)` | PATCH | `/api/v1/superadmin/integrations/gateways/:id` | `GatewayUpdatePayload` | `IntegrationGatewayItem` |
| `testIntegrationGatewayPing(id)` | POST | `/api/v1/superadmin/integrations/gateways/:id/test` | — | `{ status, latencyMs, message }` |
| `toggleIntegrationGateway(id, enabled)` | PATCH | `/api/v1/superadmin/integrations/gateways/:id/toggle` | `{ isEnabled }` | `IntegrationGatewayItem` |
| `fetchWebhookEndpoints()` | GET | `/api/v1/superadmin/integrations/webhooks` | — | `WebhookEndpointItem[]` |
| `createWebhookEndpoint(payload)` | POST | `/api/v1/superadmin/integrations/webhooks` | `WebhookCreatePayload` | `WebhookEndpointItem` |
| `deleteWebhookEndpoint(id)` | DELETE | `/api/v1/superadmin/integrations/webhooks/:id` | — | `{ id: string }` |
| `fetchWebhookRetries()` | GET | `/api/v1/superadmin/integrations/webhooks/retries` | — | `WebhookRetryItem[]` |
| `triggerWebhookRetry(deliveryId)` | POST | `/api/v1/superadmin/integrations/webhooks/retries/:id/retry` | — | `{ deliveryId, status }` |
| `fetchApiKeys()` | GET | `/api/v1/superadmin/integrations/api-keys` | — | `ApiKeyItem[]` |
| `createApiKey(payload)` | POST | `/api/v1/superadmin/integrations/api-keys` | `ApiKeyCreatePayload` | `ApiKeyCreatedResult` |
| `rotateApiKey(keyId)` | POST | `/api/v1/superadmin/integrations/api-keys/:id/rotate` | — | `ApiKeyCreatedResult` |
| `revokeApiKey(keyId)` | DELETE | `/api/v1/superadmin/integrations/api-keys/:id` | — | `{ keyId, status }` |
| `fetchRateLimits()` | GET | `/api/v1/superadmin/integrations/rate-limits` | — | `RateLimitPolicy` |
| `updateRateLimits(payload)` | PUT | `/api/v1/superadmin/integrations/rate-limits` | `RateLimitPolicy` | `RateLimitPolicy` |
| `fetchIntegrationLogs()` | GET | `/api/v1/superadmin/integrations/logs` | — | `IntegrationLogItem[]` |
| `fetchPlanEntitlements()` | GET | `/api/v1/superadmin/integrations/entitlements` | — | `PlanEntitlementItem[]` |
| `updatePlanEntitlement(planId, provider, en)` | PATCH | `/api/v1/superadmin/integrations/entitlements` | `{ planId, providerKey, isAllowed }` | `PlanEntitlementItem` |

## 5. Query Key Registry & Server State
```typescript
export const SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS = {
  all: ['superadmin_integrations_overview'] as const,
  summary: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'summary'] as const,
  gateways: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'gateways'] as const,
  webhooks: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'webhooks'] as const,
  webhookRetries: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'webhook_retries'] as const,
  apiKeys: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'api_keys'] as const,
  rateLimits: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'rate_limits'] as const,
  logs: (filters?: Record<string, unknown>) => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'logs', filters ?? {}] as const,
  entitlements: () => [...SUPERADMIN_INTEGRATIONS_OVERVIEW_KEYS.all, 'entitlements'] as const,
};
```
- **Stale Time:** 60,000ms for static registries; 30,000ms for live logs and retry queues.
- **gcTime:** 300,000ms (5 minutes).

## 6. Mutation Inventory & Lifecycle Operations
All state-modifying actions inject an `Idempotency-Key` (UUIDv4) and invalidate corresponding TanStack Query caches.

## 7. Permissions and Role Rules
- **Required Role:** `SUPERADMIN` — verified at route middleware and server API gateway.
- **Destructive Actions:** Key revocation and webhook deletion require double confirmation (`useConfirm()`).
- **Secret Visibility:** Plain-text API secrets are never returned in lists or GET endpoints. Only masked hashes are displayed.

## 8. State Ownership & Architecture Flow
- **Server State:** TanStack Query v5 (`useQuery`, `useMutation`).
- **UI Transient State:** Zustand store (`useSuperadminIntegrationsOverviewStore.ts`) — active tab, search, selected gateway for modal, inspector modal.
- **URL Query State:** `?tab=` synchronized bidirectionally.

## 9. Offline, Loading, Empty, and Error States
- **Loading:** `SuperadminIntegrationsOverviewListSkeleton.tsx` rendered at route level and component level.
- **Empty:** `SuperadminIntegrationsOverviewEmptyState.tsx` rendered when search returns zero records.
- **Error:** `SuperadminIntegrationsOverviewErrorFallback.tsx` rendered with retry CTA.

## 10. Security and PII Rules
- **Zero Plain-Text Secrets:** API keys and Webhook secrets are hashed. Newly generated keys are revealed exactly once.
- **Input Sanitization:** URL and IP rules validated through strict Zod schemas before API submission.

## 11. Accessibility Requirements (A11y)
- Full keyboard Tab navigation, visible focus rings, ARIA roles (`role="tablist"`, `role="tab"`, `role="dialog"`).

## 12. Background Tasks & Realtime Events
- Realtime WebSocket listener at `@/lib/socket` for live biometric punches and failed webhook push alerts.

## 13. Feature Flags & Tenant Settings
- Controlled via `PlanEntitlementItem` matrix.

## 14. Cache Invalidation & Consistency
- Authoritative server response reconciliation on all mutations.

## 15. Migration, Rollback & Edge Cases
- When rotating keys, old keys maintain a 24-hour overlap window to prevent breaking production worker jobs.

## 16. Test Coverage Map & Quality Gates
- **Integration Tests:** `tests/superadmin_integrations_overview.integration.test.tsx` verifying tabs, search, modals, retries.
- **Harness:** `tests/harness/SuperadminIntegrationsOverviewHarness.tsx` + `bootstrap.ts`.

## 17. Architecture Exceptions (ADRs)
- Centralized URL configuration defined at `config/superadmin_integrations_overview.url_config.ts`.

## 18. Known Contract Gaps & Bug Log
- None.

## 19. Rule Compliance Checklist (35+ Verification Items)
- [x] Universal Day-1 Sub-Module Architecture verified.
- [x] Zero Cross-Module Business Imports verified.
- [x] File Size Ceilings respected (all components <= 300 lines).
- [x] Strict TypeScript (no `any`) enforced.
- [x] Semantic theme tokens used (no arbitrary brackets, no opacity modifiers on semantic tokens).
- [x] Centralized URL config present and used.
- [x] Idempotency keys attached to mutations.
- [x] Destructive actions use double verification (`useConfirm`).
- [x] Co-located integration tests and standalone harness created.

## 20. Standalone Run, Mock & Test Harness
- **Route Path:** `/superadmin/superadmin_integrations/integrations_overview`
- **Unit / Component Test Suite:** `npm run test -- src/app/frontend_superadmin/superadmin_integrations/integrations_overview`
- **Test Harness:** `tests/harness/SuperadminIntegrationsOverviewHarness.tsx` mounts the module in 100% isolation with MSW server.

## 21. Module Portability & Host Integration Guide
1. Copy `src/app/frontend_superadmin/superadmin_integrations/integrations_overview` to host project.
2. Ensure host provides `@/lib/api`, `@/lib/logger`, `@/components/ui/dialog`.
3. Register `/superadmin/superadmin_integrations/integrations_overview` in navigation shell.

## 22. Deliverables & Version History (8/8 Portability Score)
- [x] 1. ZIP Self-Sufficiency
- [x] 2. Zero Cross-Module Business Imports
- [x] 3. Mock Parity & Scenario Completeness
- [x] 4. Standalone Harness / Bootstrap
- [x] 5. Token Integrity
- [x] 6. Triad UI States
- [x] 7. Mutation Safety
- [x] 8. Responsive Breakpoints
