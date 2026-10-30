import { AdminStaffRolesPermissionsScenarios as HarnessScenarioList } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/tests/harness/bootstrap';
import { render, screen } from '@testing-library/react';

import { describe, expect, it } from 'vitest';

import { AdminStaffRolesPermissionsHarness } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/tests/harness/AdminStaffRolesPermissionsHarness';


import { afterEach } from 'vitest';

import { fetchAdminStaffRolesPermissions } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/api/admin_staff_roles_permissions.api';

import { AdminStaffRolesPermissionsApiResponseSchema } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/schemas/AdminStaffRolesPermissionsSchema';

import { ADMIN_STAFF_ROLES_PERMISSIONS_API_FIXTURE } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/mocks/AdminStaffRolesPermissionsDemoState';

import { readFileSync } from 'node:fs';

import { fileURLToPath } from 'node:url';

import path from 'node:path';

import { getAdminStaffRolesPermissionsDemoState, resetAdminStaffRolesPermissionsDemoState, saveAdminStaffRolesPermissionsDemoState } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/mocks/AdminStaffRolesPermissionsDemoState';

import { resolveAdminStaffRolesPermissionsRoleEntry } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/utils/AdminStaffRolesPermissionsRoleUtils';

describe("Consolidated: AdminStaffRolesPermissionsHarness", () => {
});

describe("Consolidated: AdminStaffRolesPermissionsRegressionSuite", () => {
    describe('Original suite: AdminStaffRolesPermissionsApi.test.ts', () => {
        describe('staff roles and permissions contract boundary', () => {
            it('rejects blank module/action labels and empty role maps', () => {
                expect(AdminStaffRolesPermissionsApiResponseSchema.safeParse([{ module: ' ', actions: [] }]).success).toBe(false);
                expect(AdminStaffRolesPermissionsApiResponseSchema.safeParse([{ module: 'members', actions: [{ label: '', key: 'members.read', roles: { admin: true } }] }]).success).toBe(false);
                expect(AdminStaffRolesPermissionsApiResponseSchema.safeParse([{ module: 'members', actions: [{ label: 'View', key: ' ', roles: { admin: true } }] }]).success).toBe(false);
                expect(AdminStaffRolesPermissionsApiResponseSchema.safeParse([{ module: 'members', actions: [{ label: 'View', key: 'members.read', roles: {} }] }]).success).toBe(false);
            });
            it('keeps the synthetic fixture schema-valid for explicit demo mode only', () => {
                expect(AdminStaffRolesPermissionsApiResponseSchema.safeParse(ADMIN_STAFF_ROLES_PERMISSIONS_API_FIXTURE).success).toBe(true);
            });
            it('fails closed when live permission API contract is missing', async () => {
                await expect(fetchAdminStaffRolesPermissions()).rejects.toThrow(/CONTRACT_MISSING: No verified backend API endpoint/);
            });
        });
    });
    describe('Original suite: AdminStaffRolesPermissionsContract.test.ts', () => {
        const here = path.dirname(fileURLToPath(import.meta.url));
        describe('access roles boundary', () => { it('keeps authorization server-side and avoids treating the canonical UI route as an API', () => { const source = readFileSync(path.join(here, '../components/AdminStaffRolesPermissionsPage'), 'utf8'); expect(source).toContain('ACCESS_ROLES_NOTICE'); expect(source).toContain('isFrontendDemoModeEnabled'); expect(source).toContain('SAVE_HELP_BLOCKED'); }); });
    });
    describe('Original suite: AdminStaffRolesPermissionsDemoState.test.ts', () => {
        afterEach(() => resetAdminStaffRolesPermissionsDemoState());
        describe('staff roles and permissions demo state', () => {
            it('saves mutable permission changes for subsequent mounts in the session', () => {
                const current = getAdminStaffRolesPermissionsDemoState();
                expect(current[0]?.actions[0]?.roles.admin).toBe(true);
                const changed = current.map((module) => ({
                    ...module,
                    actions: module.actions.map((action) => ({ ...action, roles: { ...action.roles, manager: true } })),
                }));
                saveAdminStaffRolesPermissionsDemoState(changed);
                expect(getAdminStaffRolesPermissionsDemoState()[0]?.actions[0]?.roles.manager).toBe(true);
            });
            it('returns defensive copies so callers cannot mutate the stored state accidentally', () => {
                const current = getAdminStaffRolesPermissionsDemoState();
                if (current[0]?.actions[0])
                    current[0].actions[0].roles.admin = false;
                expect(getAdminStaffRolesPermissionsDemoState()[0]?.actions[0]?.roles.admin).toBe(true);
            });
        });
    });
    describe('Original suite: AdminStaffRolesPermissionsRoleUtils.test.ts', () => {
        describe('resolveAdminStaffRolesPermissionsRoleEntry', () => {
            it('resolves the lowercase API role key without changing its casing', () => {
                expect(resolveAdminStaffRolesPermissionsRoleEntry({ admin: true, manager: false }, 'manager')).toEqual({ key: 'manager', value: false });
            });
            it('tolerates casing differences in the upstream role key', () => {
                expect(resolveAdminStaffRolesPermissionsRoleEntry({ Manager: true }, 'manager')).toEqual({ key: 'Manager', value: true });
            });
            it('returns an unknown state rather than fabricating disabled when the role field is absent', () => {
                expect(resolveAdminStaffRolesPermissionsRoleEntry({ admin: true, trainer: false }, 'manager')).toEqual({ key: null, value: null });
            });
            it('returns an unknown state when a matched role is malformed and has no boolean value', () => {
                const malformedRoles = { admin: undefined } as unknown as Record<string, boolean>;
                expect(resolveAdminStaffRolesPermissionsRoleEntry(malformedRoles, 'admin')).toEqual({ key: null, value: null });
            });
        });
    });
});
