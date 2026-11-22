import { describe, it, expect } from 'vitest';
import {
  SuperadminRoleCreateSchema,
  SuperadminRolePermissionUpdateSchema,
  SuperadminAccountLockSchema,
  SuperadminAccountTempElevationSchema,
} from '../schemas/superadmin_users_roles_permissions.schema';

describe('Superadmin Roles & Permissions Zod Schemas', () => {
  it('validates role creation form schema', () => {
    const valid = {
      name: 'Shift Incharge',
      description: 'Supervises evening shift members and seat allocations',
    };
    expect(SuperadminRoleCreateSchema.safeParse(valid).success).toBe(true);

    const invalid = {
      name: 'S',
      description: 'Sh',
    };
    expect(SuperadminRoleCreateSchema.safeParse(invalid).success).toBe(false);
  });

  it('validates role permission matrix payload schema', () => {
    const valid = {
      roleKey: 'branch_manager',
      permissions: {
        members: { view: true, create: true, edit: true, delete_archive: false },
        finance: { view: true, export: false },
      },
    };
    expect(SuperadminRolePermissionUpdateSchema.safeParse(valid).success).toBe(true);
  });

  it('validates security account lock schema with reason requirement', () => {
    const valid = {
      userId: 'usr-001',
      reason: 'Repeated unauthorized access attempts flagged by IDS',
    };
    expect(SuperadminAccountLockSchema.safeParse(valid).success).toBe(true);

    const invalid = {
      userId: 'usr-001',
      reason: 'No',
    };
    expect(SuperadminAccountLockSchema.safeParse(invalid).success).toBe(false);
  });

  it('validates temporary elevation schema with duration bounds', () => {
    const valid = {
      userId: 'usr-002',
      elevatedRole: 'superadmin',
      durationHours: 24,
      justification: 'Weekend emergency database maintenance deployment',
    };
    expect(SuperadminAccountTempElevationSchema.safeParse(valid).success).toBe(true);

    const invalidDuration = {
      userId: 'usr-002',
      elevatedRole: 'superadmin',
      durationHours: 500, // exceeds 168 hours max
      justification: 'Testing',
    };
    expect(SuperadminAccountTempElevationSchema.safeParse(invalidDuration).success).toBe(false);
  });
});
