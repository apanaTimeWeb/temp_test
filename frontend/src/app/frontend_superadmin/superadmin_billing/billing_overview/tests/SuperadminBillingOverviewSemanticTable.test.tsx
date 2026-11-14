// RESPONSIBILITY: Define source-level test coverage for billing overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_overview/tests/SuperadminBillingOverviewSemanticTable.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SuperadminBillingOverviewSemanticTable, { type SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/components/SuperadminBillingOverviewSemanticTable';

type Row = { id: string; name: string; status: string };
const rows: Row[] = [
  { id: 'row-b', name: 'Beta', status: 'Active' },
  { id: 'row-a', name: 'Alpha', status: 'Paused' },
];
const columns: SemanticColumnDef<Row>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'status', headerName: 'Status' },
];

describe('SuperadminBillingOverviewSemanticTable', () => {
  it('sorts and paginates while preserving semantic headers', () => {
    render(<SuperadminBillingOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeTruthy();
    expect(screen.getAllByRole('cell')[0].getAttribute('data-label')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /sort by name/i }));
    expect(screen.getByText('Alpha')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('filters to an empty state and resets pagination to the first page', () => {
    render(<SuperadminBillingOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    const filter = screen.getByRole('searchbox');
    fireEvent.change(filter, { target: { value: 'Active' } });
    expect(screen.getByText('Beta')).toBeTruthy();
    expect(screen.queryByText('Alpha')).toBeNull();
    fireEvent.change(filter, { target: { value: 'not-present' } });
    expect(screen.getByRole('status').textContent).toMatch(/no rows/i);
  });
  it('renders an explicit empty-data state for an empty source collection', () => {
    render(<SuperadminBillingOverviewSemanticTable rowData={[]} columnDefs={columns} />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
