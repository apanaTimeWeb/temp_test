import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminSystemAuditLogsHarness } from '@/app/frontend_admin/admin_system/system_audit_logs/tests/harness/AdminSystemAuditLogsHarness';
import { AdminSystemAuditLogsScenarios } from '@/app/frontend_admin/admin_system/system_audit_logs/tests/harness/bootstrap';

describe('admin_audit_logs_main local scenario harness', () => {
  it.each(AdminSystemAuditLogsScenarios)('exposes the %s scenario without assuming a backend DTO', (scenario) => {
    render(<AdminSystemAuditLogsHarness scenario={scenario}>Feature content</AdminSystemAuditLogsHarness>);
    expect(screen.getByTestId('admin_system_audit_logs-harness').getAttribute('data-scenario')).toBe(
      scenario === 'SERVER_500' ? 'server-error' : scenario.toLowerCase(),
    );
    expect(screen.getByText('Feature content')).toBeTruthy();
  });
});
