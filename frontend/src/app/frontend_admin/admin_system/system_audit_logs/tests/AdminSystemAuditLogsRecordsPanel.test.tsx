import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AdminAuditLogsRecordsPanel from '@/app/frontend_admin/admin_system/system_audit_logs/components/AdminSystemAuditLogsRecordsPanel';
import type { AdminAuditLogsRecord } from '@/app/frontend_admin/admin_system/system_audit_logs/types/AdminSystemAuditLogsTypes';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

const record: AdminAuditLogsRecord = {
  id: 'audit-1',
  action: 'Updated profile',
  module: 'Profile',
  performedBy: 'Demo Admin',
  role: 'Administrator',
  details: 'Changed display preference',
  severity: 'info',
  timestamp: '2026-10-17T10:00:00Z',
  ip: '192.0.2.10',
};

describe('AdminAuditLogsRecordsPanel row details interaction', () => {
  it('invokes the record detail callback for desktop pointer and keyboard activation', () => {
    const onRowClicked = vi.fn();
    render(<AdminAuditLogsRecordsPanel records={[record]} isLoading={false} errorMessage={null} hasActiveFilter={false} onRetry={vi.fn()} onRowClicked={onRowClicked} />);
    const table = screen.getByRole('table', { name: 'TABLE_LABEL' });
    const row = within(table).getByText(record.action).closest('tr');
    expect(row).toBeTruthy();
    fireEvent.click(row!);
    fireEvent.keyDown(row!, { key: 'Enter' });
    expect(onRowClicked).toHaveBeenCalledTimes(2);
    expect(onRowClicked).toHaveBeenLastCalledWith(record);
  });
});
