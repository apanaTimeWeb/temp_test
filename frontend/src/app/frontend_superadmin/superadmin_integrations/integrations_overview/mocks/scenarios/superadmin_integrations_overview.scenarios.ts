// mocks/scenarios/superadmin_integrations_overview.scenarios.ts
// 5 Canonical scenarios registry covering all state permutations.
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

export const SUPERADMIN_INTEGRATIONS_OVERVIEW_SCENARIOS = {
  ACTIVE_RECORDS: {
    status: 200,
    summary: { success: true, message: 'OK', data: MOCK_INTEGRATION_SUMMARY, requestId: 'req_scen_act_001' },
    gateways: { success: true, message: 'OK', data: MOCK_INTEGRATION_GATEWAYS, requestId: 'req_scen_act_002' },
    webhooks: { success: true, message: 'OK', data: MOCK_WEBHOOKS, requestId: 'req_scen_act_003' },
    webhookRetries: { success: true, message: 'OK', data: MOCK_WEBHOOK_RETRIES, requestId: 'req_scen_act_004' },
    apiKeys: { success: true, message: 'OK', data: MOCK_API_KEYS, requestId: 'req_scen_act_005' },
    rateLimits: { success: true, message: 'OK', data: MOCK_RATE_LIMIT_POLICY, requestId: 'req_scen_act_006' },
    logs: { success: true, message: 'OK', data: MOCK_INTEGRATION_LOGS, requestId: 'req_scen_act_007' },
    entitlements: { success: true, message: 'OK', data: MOCK_PLAN_ENTITLEMENTS, requestId: 'req_scen_act_008' },
  },
  EMPTY_DATA: {
    status: 200,
    summary: {
      success: true,
      message: 'Zero integrations found',
      data: { totalGateways: 0, activeGateways: 0, testModeGateways: 0, failedWebhooksCount: 0, activeApiKeysCount: 0, todayApiRequestsCount: 0 },
      requestId: 'req_scen_empty_001',
    },
    gateways: { success: true, message: 'Zero gateways', data: [], requestId: 'req_scen_empty_002' },
    webhooks: { success: true, message: 'Zero webhooks', data: [], requestId: 'req_scen_empty_003' },
    webhookRetries: { success: true, message: 'Zero failed retries', data: [], requestId: 'req_scen_empty_004' },
    apiKeys: { success: true, message: 'Zero API keys', data: [], requestId: 'req_scen_empty_005' },
    rateLimits: { success: true, message: 'Default limits', data: MOCK_RATE_LIMIT_POLICY, requestId: 'req_scen_empty_006' },
    logs: { success: true, message: 'Zero logs', data: [], requestId: 'req_scen_empty_007' },
    entitlements: { success: true, message: 'Zero plans', data: [], requestId: 'req_scen_empty_008' },
  },
  SERVER_500_ERROR: {
    status: 500,
    envelope: {
      success: false,
      message: 'Internal Gateway Hub Service Failure (500)',
      data: null,
      errorCode: 'ERR_GATEWAY_SERVICE_UNAVAILABLE',
      statusCode: 500,
      requestId: 'req_scen_500_001',
    },
  },
  NETWORK_TIMEOUT: {
    delayMs: 15000,
    status: 504,
    envelope: {
      success: false,
      message: 'Gateway Timeout: Gateway connection exceeded 15,000ms threshold',
      data: null,
      errorCode: 'ERR_INTEGRATION_GATEWAY_TIMEOUT',
      statusCode: 504,
      requestId: 'req_scen_504_001',
    },
  },
  UNAUTHORIZED_401: {
    status: 401,
    envelope: {
      success: false,
      message: 'SuperAdmin integration management token expired',
      data: null,
      errorCode: 'ERR_INTEGRATION_SESSION_UNAUTHORIZED',
      statusCode: 401,
      requestId: 'req_scen_401_001',
    },
  },
} as const;
