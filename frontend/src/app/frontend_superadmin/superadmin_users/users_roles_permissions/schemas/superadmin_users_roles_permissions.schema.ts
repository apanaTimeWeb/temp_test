// RESPONSIBILITY: Zod validation schemas for Superadmin Roles & Permissions and User Security controls.
import { z } from 'zod';

export const SuperadminRoleCreateSchema = z.object({
  name: z.string().min(3, 'Role name must be at least 3 characters').max(50, 'Role name cannot exceed 50 characters'),
  description: z.string().min(5, 'Role description must be at least 5 characters').max(200, 'Description cannot exceed 200 characters'),
  baseRoleKey: z.string().optional(),
});

export type SuperadminRoleCreateFormValues = z.infer<typeof SuperadminRoleCreateSchema>;

export const SuperadminRolePermissionUpdateSchema = z.object({
  roleKey: z.string().min(1, 'Role identifier is required'),
  permissions: z.record(z.string(), z.record(z.string(), z.boolean())),
});

export type SuperadminRolePermissionUpdateValues = z.infer<typeof SuperadminRolePermissionUpdateSchema>;

export const SuperadminAccountLockSchema = z.object({
  userId: z.string().min(1, 'User identifier is required'),
  reason: z.string().min(5, 'Mandatory security lock reason is required (min 5 characters)'),
});

export type SuperadminAccountLockValues = z.infer<typeof SuperadminAccountLockSchema>;

export const SuperadminAccountTempElevationSchema = z.object({
  userId: z.string().min(1, 'User identifier is required'),
  elevatedRole: z.string().min(1, 'Elevated role must be selected'),
  durationHours: z.number().int().min(1, 'Minimum elevation duration is 1 hour').max(168, 'Maximum 168 hours (7 days)'),
  justification: z.string().min(5, 'Elevation justification is required'),
});

export type SuperadminAccountTempElevationValues = z.infer<typeof SuperadminAccountTempElevationSchema>;
