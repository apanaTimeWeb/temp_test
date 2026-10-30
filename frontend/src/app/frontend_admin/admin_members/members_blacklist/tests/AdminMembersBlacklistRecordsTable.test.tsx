import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AdminBlacklistRecordsTable from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistRecordsTable';
import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));

const record: AdminBlacklistRecord = {
  id: 'blacklist-1',
  name: 'Demo Student',
  phone: '9876543210',
  reason: 'Policy violation',
  blacklistedBy: 'Demo Admin',
  blacklistedOn: '2026-10-17',
  previousSeat: 'A-12',
  status: 'Blacklisted',
};
const columns: readonly DataGridColumn<AdminBlacklistRecord>[] = [
  { field: 'name', headerName: 'Student' },
  { field: 'reason', headerName: 'Reason' },
];

describe('AdminBlacklistRecordsTable row details interaction', () => {
  it('opens the selected record through the shared accessible row action', () => {
    const onRowClicked = vi.fn();
    render(<AdminBlacklistRecordsTable records={[record]} columns={columns} onRowClicked={onRowClicked} />);
    const table = screen.getByRole('table', { name: 'TABLE_LABEL' });
    const row = within(table).getByText(record.name).closest('tr');
    expect(row).toBeTruthy();
    fireEvent.click(row!);
    expect(onRowClicked).toHaveBeenCalledWith(record);
  });
});
