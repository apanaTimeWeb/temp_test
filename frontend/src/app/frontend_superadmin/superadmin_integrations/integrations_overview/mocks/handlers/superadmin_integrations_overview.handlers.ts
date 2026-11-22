// mocks/handlers/superadmin_integrations_overview.handlers.ts
// MSW v2 handlers returning canonical ApiResponse<T> envelopes.
import { http, HttpResponse } from 'msw';
import { SUPERADMIN_INTEGRATIONS_OVERVIEW_API } from '../../config/superadmin_integrations_overview.url_config';
import {
  MOCK_API_KEYS,
  MOCK_INTEGRATION_GATEWAYS,
  MOCK_INTEGRATION_LOGS,
  MOCK_INTEGRATION_SUMMARY,
  MOCK_PLAN_ENTITLEMENTS,
  MOCK_RATE_LIMIT_POLICY,
  MOCK_WEBHOOK_RETRIES,
  MOCK_WEBHOOKS,
} from '../fixtures/superadmin_integrations_overview.fixtures';

export const superadminIntegrationsOverviewHandlers = [
  // 1. Summary Stats & Gateways
  http.get(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.summary, () =>
    HttpResponse.json({
      success: true,
      message: 'Integration summary fetched successfully',
      data: MOCK_INTEGRATION_SUMMARY,
      requestId: 'req_summary_mock_001',
    })
  ),

  http.get(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewaysList, () =>
    HttpResponse.json({
      success: true,
      message: 'Integration gateways list fetched',
      data: MOCK_INTEGRATION_GATEWAYS,
      requestId: 'req_gw_list_001',
    })
  ),

  // 2. Gateway Mutations & Ping
  http.patch(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewayUpdate(':id'), async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const existing = MOCK_INTEGRATION_GATEWAYS.find((g) => g.id === id) || MOCK_INTEGRATION_GATEWAYS[0];
    const updated = { ...existing, ...body };
    return HttpResponse.json({
      success: true,
      message: `${updated?.name ?? 'Provider'} configuration saved successfully`,
      data: updated,
      requestId: `req_gw_update_${id}`,
    });
  }),

  http.post(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewayTestPing(':id'), ({ params }) =>
    HttpResponse.json({
      success: true,
      message: `Live test ping succeeded! Latency: 78ms`,
      data: { status: 'connected', latencyMs: 78, message: `Connected to ${params.id} gateway` },
      requestId: `req_ping_${params.id}`,
    })
  ),

  http.patch(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.gatewayToggle(':id'), async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json().catch(() => ({}))) as { isEnabled?: boolean };
    const existing = MOCK_INTEGRATION_GATEWAYS.find((g) => g.id === id) || MOCK_INTEGRATION_GATEWAYS[0];
    const updated = { ...existing, isEnabled: body.isEnabled ?? !existing?.isEnabled };
    return HttpResponse.json({
      success: true,
      message: `Gateway ${updated.name} ${updated.isEnabled ? 'enabled' : 'disabled'} successfully`,
      data: updated,
      requestId: `req_toggle_${id}`,
    });
  }),

  // 3. Webhooks & Retries
  http.get(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhooksList, () =>
    HttpResponse.json({
      success: true,
      message: 'Webhook endpoints fetched',
      data: MOCK_WEBHOOKS,
      requestId: 'req_wh_list_001',
    })
  ),

  http.post(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookCreate, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const newWh = {
      id: `wh_${Date.now()}`,
      url: String(body.url ?? 'https://webhook.site/test'),
      description: String(body.description ?? 'Test webhook'),
      events: (body.events as string[]) ?? ['tenant.created'],
      secretMasked: 'whsec_••••••••••••••••999a',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastDeliveredAt: 'Never',
      successRate: '100%',
    };
    return HttpResponse.json({
      success: true,
      message: 'Webhook endpoint registered successfully',
      data: newWh,
      requestId: 'req_wh_create_001',
    });
  }),

  http.delete(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookDelete(':id'), ({ params }) =>
    HttpResponse.json({
      success: true,
      message: 'Webhook endpoint removed',
      data: { id: String(params.id) },
      requestId: `req_wh_del_${params.id}`,
    })
  ),

  http.get(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookRetriesList, () =>
    HttpResponse.json({
      success: true,
      message: 'Failed webhook retries queue fetched',
      data: MOCK_WEBHOOK_RETRIES,
      requestId: 'req_retry_list_001',
    })
  ),

  http.post(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.webhookRetryTrigger(':id'), ({ params }) =>
    HttpResponse.json({
      success: true,
      message: 'Webhook redelivered successfully (Status: 200 OK)',
      data: { deliveryId: String(params.id), status: 'success' },
      requestId: `req_retry_trig_${params.id}`,
    })
  ),

  // 4. API Keys (Generate, Rotate, Revoke)
  http.get(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeysList, () =>
    HttpResponse.json({
      success: true,
      message: 'API keys list fetched',
      data: MOCK_API_KEYS,
      requestId: 'req_keys_list_001',
    })
  ),

  http.post(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeyCreate, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const plainSecret = `pk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 15)}`;
    const newKey = {
      id: `key_${Date.now()}`,
      name: String(body.name ?? 'New API Key'),
      prefix: plainSecret.slice(0, 12),
      maskedKey: `${plainSecret.slice(0, 12)}••••••••••••${plainSecret.slice(-4)}`,
      roleScope: String(body.roleScope ?? 'Platform Developer'),
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      lastUsedAt: 'Never',
      ipAllowlist: (body.ipAllowlist as string[]) ?? [],
      rateLimitRpm: Number(body.rateLimitRpm ?? 300),
    };
    return HttpResponse.json({
      success: true,
      message: 'API key generated. Copy this secret now as it will never be displayed again.',
      data: { keyItem: newKey, plainTextSecret: plainSecret },
      requestId: 'req_key_create_001',
    });
  }),

  http.post(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeyRotate(':id'), ({ params }) => {
    const plainSecret = `pk_live_rotated_${Math.random().toString(36).substring(2, 15)}`;
    const rotatedKey = {
      ...MOCK_API_KEYS[0],
      id: String(params.id),
      prefix: plainSecret.slice(0, 12),
      maskedKey: `${plainSecret.slice(0, 12)}••••••••••••${plainSecret.slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json({
      success: true,
      message: 'API key rotated successfully. The previous key will expire in 24 hours.',
      data: { keyItem: rotatedKey, plainTextSecret: plainSecret },
      requestId: `req_rotate_${params.id}`,
    });
  }),

  http.delete(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.apiKeyRevoke(':id'), ({ params }) =>
    HttpResponse.json({
      success: true,
      message: 'API key revoked immediately and access suspended',
      data: { keyId: String(params.id), status: 'revoked' },
      requestId: `req_revoke_${params.id}`,
    })
  ),

  // 5. Rate Limits & Policies
  http.get(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.rateLimitsGet, () =>
    HttpResponse.json({
      success: true,
      message: 'Rate limit policies fetched',
      data: MOCK_RATE_LIMIT_POLICY,
      requestId: 'req_ratelimits_001',
    })
  ),

  http.put(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.rateLimitsUpdate, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const updated = { ...MOCK_RATE_LIMIT_POLICY, ...body };
    return HttpResponse.json({
      success: true,
      message: 'Rate limits & IP allowlist updated successfully',
      data: updated,
      requestId: 'req_ratelimits_update_001',
    })
  }),

  // 6. Logs & Plan Entitlements
  http.get(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.logsList, () =>
    HttpResponse.json({
      success: true,
      message: 'Integration logs retrieved',
      data: MOCK_INTEGRATION_LOGS,
      requestId: 'req_logs_001',
    })
  ),

  http.get(SUPERADMIN_INTEGRATIONS_OVERVIEW_API.entitlementsList, () =>
    HttpResponse.json({
      success: true,
      message: 'Plan entitlements retrieved',
      data: MOCK_PLAN_ENTITLEMENTS,
      requestId: 'req_entitlements_001',
    })
  ),
];
