// RESPONSIBILITY: Define source-level test coverage for dashboard overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_dashboard/dashboard_overview/tests/SuperadminDashboardOverviewSemanticTable.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SuperadminDashboardOverviewSemanticTable, { type SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewSemanticTable';

type Row = { id: string; name: string; status: string };
const rows: Row[] = [
  { id: 'row-b', name: 'Beta', status: 'Active' },
  { id: 'row-a', name: 'Alpha', status: 'Paused' },
];
const columns: SemanticColumnDef<Row>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'status', headerName: 'Status' },
];

describe('SuperadminDashboardOverviewSemanticTable', () => {
  it('sorts and paginates while preserving semantic headers', () => {
    render(<SuperadminDashboardOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeTruthy();
    expect(document.querySelector('thead')?.className).toContain('bg-surface-highlight');
    const bodyRows = screen.getAllByRole('row').slice(1);
    expect(bodyRows[0].className).toContain('bg-card');
    expect(bodyRows[1].className).toContain('bg-surface-zebra');
    expect(bodyRows[0].className).toContain('hover:bg-surface-hover');
    expect(screen.getAllByRole('cell')[0].getAttribute('data-label')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /sort by name/i }));
    expect(screen.getByRole('columnheader', { name: /name.*ascending/i }).getAttribute('aria-sort')).toBe('ascending');
    expect(screen.getByText('Alpha')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /ascending/i }));
    expect(screen.getByRole('columnheader', { name: /name.*descending/i }).getAttribute('aria-sort')).toBe('descending');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('filters to an empty state and resets pagination to the first page', () => {
    render(<SuperadminDashboardOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    const filter = screen.getByRole('searchbox');
    fireEvent.change(filter, { target: { value: 'Active' } });
    expect(screen.getByText('Beta')).toBeTruthy();
    expect(screen.queryByText('Alpha')).toBeNull();
    fireEvent.change(filter, { target: { value: 'not-present' } });
    expect(screen.getByRole('status').textContent).toMatch(/no rows/i);
  });
  it('renders an explicit empty-data state for an empty source collection', () => {
    render(<SuperadminDashboardOverviewSemanticTable rowData={[]} columnDefs={columns} />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
