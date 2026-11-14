// RESPONSIBILITY: Define source-level test coverage for users roles permissions using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_roles_permissions/tests/SuperadminUsersRolesPermissionsPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMIN_USERS_ROLES_PERMISSIONS_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_users_roles_permissions.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_users/users_roles_permissions preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
});
