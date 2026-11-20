// types/superadmin_integrations_overview.types.ts
// Strict TypeScript interfaces for SuperAdmin Integration & API Management.
import type {
  IntegrationCategoryId,
  IntegrationEnvironment,
  IntegrationStatus,
  WebhookEventName,
  ApiKeyStatus,
  IntegrationTabId,
} from '../constants/superadmin_integrations_overview.constants';

export interface IntegrationGatewayItem {
  id: string;
  name: string;
  category: IntegrationCategoryId;
  providerKey: string; // 'razorpay' | 'stripe' | 'msg91' | 'whatsapp' | 'smtp' | 's3' | 'barcode' | 'biometric'
  status: IntegrationStatus;
  environment: IntegrationEnvironment;
  lastPing: string;
  isEnabled: boolean;
  credentialsMasked: Record<string, string>;
  notes?: string;
}

export interface WebhookEndpointItem {
  id: string;
  url: string;
  description: string;
  events: WebhookEventName[];
  secretMasked: string;
  isActive: boolean;
  createdAt: string;
  lastDeliveredAt: string;
  successRate: string;
}

export interface WebhookRetryItem {
  id: string;
  webhookId: string;
  eventName: string;
  targetUrl: string;
  statusCode: number;
  errorMessage: string;
  attemptsCount: number;
  maxAttempts: number;
  lastAttemptAt: string;
  payloadSnippet: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  maskedKey: string;
  roleScope: string;
  status: ApiKeyStatus;
  createdAt: string;
  lastUsedAt: string;
  ipAllowlist: string[];
  rateLimitRpm: number;
}

export interface RateLimitPolicy {
  requestsPerMinute: number;
  dailyQuota: number;
  burstLimit: number;
  enforceIpAllowlist: boolean;
  globalIpAllowlist: string[];
}

export interface IntegrationLogItem {
  id: string;
  timestamp: string;
  provider: string;
  category: string;
  direction: 'inbound' | 'outbound';
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  requestId: string;
  requestPayload: string;
  responsePayload: string;
}

export interface PlanEntitlementItem {
  planId: string;
  planName: string;
  tier: 'Free' | 'Starter' | 'Growth' | 'Enterprise';
  allowedProviders: Record<string, boolean>;
}

export interface IntegrationSummaryStats {
  totalGateways: number;
  activeGateways: number;
  testModeGateways: number;
  failedWebhooksCount: number;
  activeApiKeysCount: number;
  todayApiRequestsCount: number;
}

export interface GatewayUpdatePayload {
  environment: IntegrationEnvironment;
  credentials: Record<string, string>;
  isEnabled: boolean;
  notes?: string;
}

export interface WebhookCreatePayload {
  url: string;
  description: string;
  events: WebhookEventName[];
  isActive: boolean;
}

export interface ApiKeyCreatePayload {
  name: string;
  roleScope: string;
  ipAllowlist: string[];
  rateLimitRpm: number;
}

export interface ApiKeyCreatedResult {
  keyItem: ApiKeyItem;
  plainTextSecret: string; // ONLY returned once upon creation!
}
