// schemas/superadmin_integrations_overview.schemas.ts
// Runtime Zod validation schemas for forms and API payloads.
import { z } from 'zod';

export const gatewayUpdateSchema = z.object({
  environment: z.enum(['Production', 'Sandbox']),
  credentials: z.record(z.string().min(1, 'Field name required'), z.string().min(1, 'Value required')),
  isEnabled: z.boolean(),
  notes: z.string().max(300, 'Max 300 characters').optional(),
});

export const webhookCreateSchema = z.object({
  url: z.string().url('Must be a valid HTTPS webhook URL').startsWith('https://', 'Webhook URL must use secure HTTPS'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(150),
  events: z.array(z.string()).min(1, 'Select at least one event trigger'),
  isActive: z.boolean().default(true),
});

export const apiKeyCreateSchema = z.object({
  name: z.string().min(3, 'Key name must be at least 3 characters').max(60),
  roleScope: z.string().min(1, 'Select a role scope'),
  ipAllowlist: z.array(z.string()).default([]),
  rateLimitRpm: z.number().int().min(10, 'Min 10 requests/min').max(5000, 'Max 5000 requests/min'),
});

export const rateLimitUpdateSchema = z.object({
  requestsPerMinute: z.number().int().min(10).max(10000),
  dailyQuota: z.number().int().min(1000).max(1000000),
  burstLimit: z.number().int().min(5).max(500),
  enforceIpAllowlist: z.boolean(),
  globalIpAllowlist: z.array(z.string()),
});

export const ipRuleSchema = z.string().regex(
  /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
  'Must be a valid IPv4 address or CIDR subnet (e.g. 192.168.1.1 or 10.0.0.0/24)'
);

export type GatewayUpdateFormValues = z.infer<typeof gatewayUpdateSchema>;
export type WebhookCreateFormValues = z.infer<typeof webhookCreateSchema>;
export type ApiKeyCreateFormValues = z.infer<typeof apiKeyCreateSchema>;
export type RateLimitFormValues = z.infer<typeof rateLimitUpdateSchema>;
