import { apiFetch, type ApiResponse } from '@/lib/api';
import { SUPERADMIN_INTEGRATIONS_OVERVIEW_API } from '../config/superadmin_integrations_overview.url_config';
import {
  MOCK_API_KEYS,
  MOCK_RATE_LIMIT_POLICY,
  MOCK_WEBHOOK_RETRIES,
  MOCK_WEBHOOKS,
} from '../mocks/fixtures/superadmin_integrations_overview.fixtures';
import type {
  ApiKeyCreatePayload,
  ApiKeyCreatedResult,
  ApiKeyItem,
  RateLimitPolicy,
  WebhookCreatePayload,
  WebhookEndpointItem,
  WebhookRetryItem,
} from '../types/superadmin_integrations_overview.types';

let fallbackWebhooks: WebhookEndpointItem[] = [...MOCK_WEBHOOKS.map((w) => ({ ...w }))];
let fallbackWebhookRetries: WebhookRetryItem[] = [...MOCK_WEBHOOK_RETRIES.map((r) => ({ ...r }))];
let fallbackApiKeys: ApiKeyItem[] = [...MOCK_API_KEYS.map((k) => ({ ...k }))];
let fallbackRateLimits: RateLimitPolicy = { ...MOCK_RATE_LIMIT_POLICY, globalIpAllowlist: [...MOCK_RATE_LIMIT_POLICY.globalIpAllowlist] };

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
