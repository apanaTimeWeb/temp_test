// RESPONSIBILITY: Define source-level test coverage for users roles permissions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_roles_permissions/tests/SuperadminUsersRolesPermissionsAsyncStateContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPONENTS = new URL('../components/', import.meta.url);

describe('users_roles_permissions async-state contract', () => {
  it('renders the accessible localized empty state when the permission matrix has no rows', () => {
    const content = readFileSync(new URL('SuperadminUsersRolesPermissionsContent.tsx', COMPONENTS), 'utf8');
    const emptyState = readFileSync(new URL('SuperadminUsersRolesPermissionsEmptyState.tsx', COMPONENTS), 'utf8');
    expect(content).toContain('rolePermissions.length === 0');
    expect(content).toContain('SuperadminUsersRolesPermissionsEmptyState');
    expect(emptyState).toContain('role="status"');
    expect(emptyState).toContain('superadmin-users-roles-permissions-empty-state');
    expect(emptyState).toContain('COPY.TABLE_EMPTY');
  });
  it('uses an accessible reduced-motion-safe loading skeleton', () => {
    const source = readFileSync(new URL('SuperadminUsersRolesPermissionsListSkeleton.tsx', COMPONENTS), 'utf8');
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('motion-reduce:animate-none');
    expect(source).toContain('key={key}');
  });
  it('provides safe localized error recovery and wires route boundaries', () => {
    const fallback = readFileSync(new URL('SuperadminUsersRolesPermissionsErrorFallback.tsx', COMPONENTS), 'utf8');
    const loading = readFileSync(new URL('../loading.tsx', import.meta.url), 'utf8');
    const error = readFileSync(new URL('../error.tsx', import.meta.url), 'utf8');
    expect(fallback).toContain('role="alert"');
    expect(fallback).toContain('COPY.MODULE_ROUTE_ERROR_MESSAGE');
    expect(fallback).not.toContain('error.stack');
    expect(loading).toContain('SuperadminUsersRolesPermissionsListSkeleton');
    expect(error).toContain('SuperadminUsersRolesPermissionsErrorFallback');
    expect(error).not.toContain('...props');
  });
});
