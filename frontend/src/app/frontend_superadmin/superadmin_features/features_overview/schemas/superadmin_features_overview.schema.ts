// RESPONSIBILITY: Zod validation schemas for Superadmin Feature & Module Control.
import { z } from 'zod';

export const TENANT_MODULE_OVERRIDE_SCHEMA = z.object({
  tenantId: z.string().min(1, 'Tenant is required'),
  tenantName: z.string().min(1, 'Tenant name is required'),
  branchId: z.string().optional(),
  branchName: z.string().optional(),
  moduleId: z.string().min(1, 'Module is required'),
  moduleName: z.string().min(1, 'Module name is required'),
  overrideStatus: z.enum(['Force_Enabled', 'Force_Disabled']),
  reason: z.string().trim().min(3, 'Audit reason is required (min 3 chars)').max(200),
  expiresAt: z.string().optional(),
});

export const PLATFORM_MODULE_TOGGLE_SCHEMA = z.object({
  moduleId: z.string().min(1),
  level: z.enum(['platform_default', 'starter', 'professional', 'enterprise']),
  enabled: z.boolean(),
});

export type TenantModuleOverrideFormValues = z.infer<typeof TENANT_MODULE_OVERRIDE_SCHEMA>;
export type PlatformModuleToggleValues = z.infer<typeof PLATFORM_MODULE_TOGGLE_SCHEMA>;
