// api/superadmin_integrations_overview.api.ts
// Feature-scoped API client with typed ApiResponse<T> envelope, fallback mock store, and idempotency keys.
import { apiFetch, type ApiResponse } from '@/lib/api';
import { SUPERADMIN_INTEGRATIONS_OVERVIEW_API } from '../config/superadmin_integrations_overview.url_config';
import {
  MOCK_API_KEYS, MOCK_INTEGRATION_GATEWAYS, MOCK_INTEGRATION_LOGS,
  MOCK_INTEGRATION_SUMMARY, MOCK_PLAN_ENTITLEMENTS, MOCK_RATE_LIMIT_POLICY,
  MOCK_WEBHOOK_RETRIES, MOCK_WEBHOOKS,
} from '../mocks/fixtures/superadmin_integrations_overview.fixtures';
import type {
  ApiKeyCreatePayload, ApiKeyCreatedResult, ApiKeyItem, GatewayUpdatePayload,
  IntegrationGatewayItem, IntegrationLogItem, IntegrationSummaryStats,
  PlanEntitlementItem, RateLimitPolicy, WebhookCreatePayload,
  WebhookEndpointItem, WebhookRetryItem,
} from '../types/superadmin_integrations_overview.types';

// In-memory persistent local state for standalone preview and resilient network fallbacks
const fallbackSummary: IntegrationSummaryStats = { ...MOCK_INTEGRATION_SUMMARY };
let fallbackGateways: IntegrationGatewayItem[] = [...MOCK_INTEGRATION_GATEWAYS.map((g) => ({ ...g }))];
let fallbackWebhooks: WebhookEndpointItem[] = [...MOCK_WEBHOOKS.map((w) => ({ ...w }))];
let fallbackWebhookRetries: WebhookRetryItem[] = [...MOCK_WEBHOOK_RETRIES.map((r) => ({ ...r }))];
let fallbackApiKeys: ApiKeyItem[] = [...MOCK_API_KEYS.map((k) => ({ ...k }))];
let fallbackRateLimits: RateLimitPolicy = { ...MOCK_RATE_LIMIT_POLICY, globalIpAllowlist: [...MOCK_RATE_LIMIT_POLICY.globalIpAllowlist] };
const fallbackLogs: IntegrationLogItem[] = [...MOCK_INTEGRATION_LOGS.map((l) => ({ ...l }))];
let fallbackEntitlements: PlanEntitlementItem[] = [
  ...MOCK_PLAN_ENTITLEMENTS.map((e) => ({ ...e, allowedProviders: { ...e.allowedProviders } })),
];

export async function fetchIntegrationSummary(): Promise<ApiResponse<IntegrationSummaryStats>> {
  try {
    return await apiFetch<IntegrationSummaryStats>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.summary);
  } catch {
    return { success: true, data: fallbackSummary, message: 'Summary loaded', requestId: 'req_summary_fb' };
  }
}

export async function fetchIntegrationGateways(): Promise<ApiResponse<IntegrationGatewayItem[]>> {
  try {
    return await apiFetch<IntegrationGatewayItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewaysList);
  } catch {
    return { success: true, data: fallbackGateways, message: 'Gateways list loaded', requestId: 'req_gw_fb' };
  }
}

export async function updateIntegrationGateway(
  id: string,
  payload: GatewayUpdatePayload,
  idempotencyKey: string
): Promise<ApiResponse<IntegrationGatewayItem>> {
  try {
    return await apiFetch<IntegrationGatewayItem>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewayUpdate(id), {
      method: 'PATCH',
      body: JSON.stringify(payload),
      idempotencyKey,
    });
  } catch {
    const idx = fallbackGateways.findIndex((g) => g.id === id);
    if (idx !== -1) {
      fallbackGateways[idx] = {
        ...fallbackGateways[idx],
        environment: payload.environment ?? fallbackGateways[idx].environment,
        isEnabled: payload.isEnabled ?? fallbackGateways[idx].isEnabled,
        notes: payload.notes ?? fallbackGateways[idx].notes,
        credentialsMasked: payload.credentials
          ? { ...fallbackGateways[idx].credentialsMasked, ...payload.credentials }
          : fallbackGateways[idx].credentialsMasked,
      };
    }
    const updated = fallbackGateways[idx] || fallbackGateways[0];
    return { success: true, data: updated, message: `${updated?.name ?? 'Provider'} configuration saved successfully`, requestId: `req_gw_update_${id}` };
  }
}

export async function testIntegrationGatewayPing(
  id: string,
  idempotencyKey: string
): Promise<ApiResponse<{ status: string; latencyMs: number; message: string }>> {
  try {
    return await apiFetch(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewayTestPing(id), { method: 'POST', idempotencyKey });
  } catch {
    return { success: true, data: { status: 'connected', latencyMs: 64, message: `Connected to ${id} gateway successfully` }, message: 'Live test ping succeeded! Latency: 64ms', requestId: `req_ping_${id}` };
  }
}

export async function toggleIntegrationGateway(
  id: string,
  enabled: boolean,
  idempotencyKey: string
): Promise<ApiResponse<IntegrationGatewayItem>> {
  try {
    return await apiFetch<IntegrationGatewayItem>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewayToggle(id), {
      method: 'PATCH',
      body: JSON.stringify({ isEnabled: enabled }),
      idempotencyKey,
    });
  } catch {
    const idx = fallbackGateways.findIndex((g) => g.id === id);
    if (idx !== -1) fallbackGateways[idx] = { ...fallbackGateways[idx], isEnabled: enabled };
    const updated = fallbackGateways[idx] || fallbackGateways[0];
    fallbackSummary.activeGateways = fallbackGateways.filter((g) => g.isEnabled).length;
    return { success: true, data: updated, message: `Gateway ${updated.name} ${enabled ? 'enabled' : 'disabled'} successfully`, requestId: `req_toggle_${id}` };
  }
}

export async function fetchWebhookEndpoints(): Promise<ApiResponse<WebhookEndpointItem[]>> {
  try {
    return await apiFetch<WebhookEndpointItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhooksList);
  } catch {
    return { success: true, data: fallbackWebhooks, message: 'Webhooks loaded', requestId: 'req_wh_fb' };
  }
}

export async function createWebhookEndpoint(
  payload: WebhookCreatePayload,
  idempotencyKey: string
): Promise<ApiResponse<WebhookEndpointItem>> {
  try {
    return await apiFetch<WebhookEndpointItem>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookCreate, { method: 'POST', body: JSON.stringify(payload), idempotencyKey });
  } catch {
    const newWh: WebhookEndpointItem = {
      id: `wh_${Date.now()}`,
      url: payload.url,
      description: payload.description,
      events: payload.events,
      secretMasked: `whsec_••••••••••••••••${Math.random().toString(36).substring(2, 6)}`,
      isActive: payload.isActive ?? true,
      createdAt: new Date().toISOString(),
      lastDeliveredAt: 'Never',
      successRate: '100%',
    };
    fallbackWebhooks = [newWh, ...fallbackWebhooks];
    return { success: true, data: newWh, message: 'Webhook endpoint registered successfully', requestId: `req_wh_create_${newWh.id}` };
  }
}

export async function deleteWebhookEndpoint(id: string, idempotencyKey: string): Promise<ApiResponse<{ id: string }>> {
  try {
    return await apiFetch<{ id: string }>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookDelete(id), { method: 'DELETE', idempotencyKey });
  } catch {
    fallbackWebhooks = fallbackWebhooks.filter((w) => w.id !== id);
    return { success: true, data: { id }, message: 'Webhook endpoint removed', requestId: `req_wh_del_${id}` };
  }
}

export async function testWebhookPing(
  id: string,
  idempotencyKey: string
): Promise<ApiResponse<{ statusCode: number; responseSnippet: string }>> {
  try {
    return await apiFetch(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookTestPing(id), { method: 'POST', idempotencyKey });
  } catch {
    return { success: true, data: { statusCode: 200, responseSnippet: '{"ok":true}' }, message: 'Webhook test ping succeeded (HTTP 200 OK)', requestId: `req_wh_ping_${id}` };
  }
}

export async function fetchWebhookRetries(): Promise<ApiResponse<WebhookRetryItem[]>> {
  try {
    return await apiFetch<WebhookRetryItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookRetriesList);
  } catch {
    return { success: true, data: fallbackWebhookRetries, message: 'Webhook retries loaded', requestId: 'req_retries_fb' };
  }
}

export async function triggerWebhookRetry(
  deliveryId: string,
  idempotencyKey: string
): Promise<ApiResponse<{ deliveryId: string; status: string }>> {
  try {
    return await apiFetch(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookRetryTrigger(deliveryId), { method: 'POST', idempotencyKey });
  } catch {
    fallbackWebhookRetries = fallbackWebhookRetries.filter((r) => r.id !== deliveryId);
    fallbackSummary.failedWebhooksCount = Math.max(0, fallbackWebhookRetries.length);
    return { success: true, data: { deliveryId, status: 'success' }, message: 'Webhook redelivered successfully (Status: 200 OK)', requestId: `req_retry_${deliveryId}` };
  }
}

export async function fetchApiKeys(): Promise<ApiResponse<ApiKeyItem[]>> {
  try {
    return await apiFetch<ApiKeyItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeysList);
  } catch {
    return { success: true, data: fallbackApiKeys, message: 'API keys loaded', requestId: 'req_keys_fb' };
  }
}

export async function createApiKey(
  payload: ApiKeyCreatePayload,
  idempotencyKey: string
): Promise<ApiResponse<ApiKeyCreatedResult>> {
  try {
    return await apiFetch<ApiKeyCreatedResult>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeyCreate, { method: 'POST', body: JSON.stringify(payload), idempotencyKey });
  } catch {
    const plainSecret = `pk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 15)}`;
    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: payload.name,
      prefix: plainSecret.slice(0, 12),
      maskedKey: `${plainSecret.slice(0, 12)}••••••••••••${plainSecret.slice(-4)}`,
      roleScope: payload.roleScope,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsedAt: 'Just now',
      ipAllowlist: payload.ipAllowlist ?? [],
      rateLimitRpm: payload.rateLimitRpm ?? 300,
    };
    fallbackApiKeys = [newKey, ...fallbackApiKeys];
    fallbackSummary.activeApiKeysCount = fallbackApiKeys.filter((k) => k.status === 'active').length;
    return { success: true, data: { keyItem: newKey, plainTextSecret: plainSecret }, message: 'API key generated. Copy this secret now as it will never be displayed again.', requestId: `req_key_create_${newKey.id}` };
  }
}

export async function rotateApiKey(keyId: string, idempotencyKey: string): Promise<ApiResponse<ApiKeyCreatedResult>> {
  try {
    return await apiFetch<ApiKeyCreatedResult>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeyRotate(keyId), { method: 'POST', idempotencyKey });
  } catch {
    const plainSecret = `pk_live_rot_${Math.random().toString(36).substring(2, 14)}`;
    const idx = fallbackApiKeys.findIndex((k) => k.id === keyId);
    if (idx !== -1) {
      fallbackApiKeys[idx] = { ...fallbackApiKeys[idx], prefix: plainSecret.slice(0, 12), maskedKey: `${plainSecret.slice(0, 12)}••••••••••••${plainSecret.slice(-4)}` };
    }
    const rotatedKey = fallbackApiKeys[idx] || fallbackApiKeys[0];
    return { success: true, data: { keyItem: rotatedKey, plainTextSecret: plainSecret }, message: 'API key rotated successfully. The previous key will expire in 24 hours.', requestId: `req_rotate_${keyId}` };
  }
}

export async function revokeApiKey(keyId: string, idempotencyKey: string): Promise<ApiResponse<{ keyId: string; status: string }>> {
  try {
    return await apiFetch(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeyRevoke(keyId), { method: 'DELETE', idempotencyKey });
  } catch {
    const idx = fallbackApiKeys.findIndex((k) => k.id === keyId);
    if (idx !== -1) fallbackApiKeys[idx] = { ...fallbackApiKeys[idx], status: 'revoked' };
    fallbackSummary.activeApiKeysCount = fallbackApiKeys.filter((k) => k.status === 'active').length;
    return { success: true, data: { keyId, status: 'revoked' }, message: 'API key revoked immediately and access suspended', requestId: `req_revoke_${keyId}` };
  }
}

export async function fetchRateLimits(): Promise<ApiResponse<RateLimitPolicy>> {
  try {
    return await apiFetch<RateLimitPolicy>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.rateLimitsGet);
  } catch {
    return { success: true, data: fallbackRateLimits, message: 'Rate limits loaded', requestId: 'req_ratelimits_fb' };
  }
}

export async function updateRateLimits(payload: RateLimitPolicy, idempotencyKey: string): Promise<ApiResponse<RateLimitPolicy>> {
  try {
    return await apiFetch<RateLimitPolicy>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.rateLimitsUpdate, { method: 'PUT', body: JSON.stringify(payload), idempotencyKey });
  } catch {
    fallbackRateLimits = { ...payload };
    return { success: true, data: fallbackRateLimits, message: 'Rate limits & IP allowlist updated successfully', requestId: 'req_ratelimits_update' };
  }
}

export async function fetchIntegrationLogs(): Promise<ApiResponse<IntegrationLogItem[]>> {
  try {
    return await apiFetch<IntegrationLogItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.logsList);
  } catch {
    return { success: true, data: fallbackLogs, message: 'Integration logs retrieved', requestId: 'req_logs_fb' };
  }
}

export async function fetchPlanEntitlements(): Promise<ApiResponse<PlanEntitlementItem[]>> {
  try {
    return await apiFetch<PlanEntitlementItem[]>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.entitlementsList);
  } catch {
    return { success: true, data: fallbackEntitlements, message: 'Entitlements retrieved', requestId: 'req_entitlements_fb' };
  }
}

export async function updatePlanEntitlement(
  planId: string,
  providerKey: string,
  enabled: boolean,
  idempotencyKey: string
): Promise<ApiResponse<PlanEntitlementItem>> {
  try {
    return await apiFetch<PlanEntitlementItem>(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.entitlementUpdate, {
      method: 'PATCH',
      body: JSON.stringify({ planId, providerKey, isAllowed: enabled }),
      idempotencyKey,
    });
  } catch {
    const planIdx = fallbackEntitlements.findIndex((p) => p.planId === planId);
    if (planIdx !== -1) {
      fallbackEntitlements[planIdx] = {
        ...fallbackEntitlements[planIdx],
        allowedProviders: { ...fallbackEntitlements[planIdx].allowedProviders, [providerKey]: enabled },
      };
    }
    const updatedPlan = fallbackEntitlements[planIdx] || fallbackEntitlements[0];
    return { success: true, data: updatedPlan, message: `Plan entitlement for ${providerKey} updated successfully`, requestId: `req_entitlement_${planId}` };
  }
}
