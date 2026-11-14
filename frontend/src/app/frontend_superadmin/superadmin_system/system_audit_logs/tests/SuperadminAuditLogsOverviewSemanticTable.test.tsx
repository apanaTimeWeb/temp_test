// RESPONSIBILITY: Define source-level test coverage for system audit logs using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_system/system_audit_logs/tests/SuperadminAuditLogsOverviewSemanticTable.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SuperadminAuditLogsOverviewSemanticTable, { type SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewSemanticTable';

type Row = { id: string; name: string; status: string };
const rows: Row[] = [
  { id: 'row-b', name: 'Beta', status: 'Active' },
  { id: 'row-a', name: 'Alpha', status: 'Paused' },
];
const columns: SemanticColumnDef<Row>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'status', headerName: 'Status' },
];

describe('SuperadminAuditLogsOverviewSemanticTable', () => {
  it('renders semantic headers, sorts rows, and paginates with stable row identity', () => {
    render(<SuperadminAuditLogsOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeTruthy();
    expect(screen.getAllByRole('cell')[0].getAttribute('data-label')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /sort by name/i }));
    expect(screen.getByText('Alpha')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('supports keyboard activation for an interactive row', () => {
    const onRowClick = vi.fn();
    render(<SuperadminAuditLogsOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} getRowId={({ data }) => data.id} onRowClick={onRowClick} hideFilter />);
    const row = screen.getByText('Beta').closest('tr');
    expect(row).toBeTruthy();
    if (row) fireEvent.keyDown(row, { key: 'Enter' });
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });


  it('resets to the first page after filtering and exposes an empty state', () => {
    render(<SuperadminAuditLogsOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Active' } });
    expect(screen.getByText('Beta')).toBeTruthy();
    expect(screen.queryByText('Alpha')).toBeNull();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'no-match' } });
    expect(screen.getByRole('status').textContent).toMatch(/no rows/i);
  });
  it('renders an explicit empty-data state for an empty source collection', () => {
    render(<SuperadminAuditLogsOverviewSemanticTable rowData={[]} columnDefs={columns} />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
