import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminStaffRolesPermissionsHarness } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/tests/harness/AdminStaffRolesPermissionsHarness';
import { AdminStaffRolesPermissionsScenarios } from '@/app/frontend_admin/admin_staff/staff_roles_permissions/tests/harness/bootstrap';

describe('admin_staff_roles_permissions local scenario harness', () => {
  it.each(AdminStaffRolesPermissionsScenarios)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    render(<AdminStaffRolesPermissionsHarness scenario={scenario}>Feature content</AdminStaffRolesPermissionsHarness>);
    expect(screen.getByTestId('admin_staff_roles_permissions-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    expect(screen.getByText('Feature content')).toBeTruthy();
  });
});
