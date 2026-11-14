// RESPONSIBILITY: Define source-level test coverage for users overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_overview/tests/SuperadminUsersOverviewSemanticTable.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SuperadminUsersOverviewSemanticTable, { type SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_users/users_overview/components/SuperadminUsersOverviewSemanticTable';

type Row = { id: string; name: string; status: string };
const rows: Row[] = [
  { id: 'row-b', name: 'Beta', status: 'Active' },
  { id: 'row-a', name: 'Alpha', status: 'Paused' },
];
const columns: SemanticColumnDef<Row>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'status', headerName: 'Status' },
];

describe('SuperadminUsersOverviewSemanticTable', () => {
  it('sorts and paginates while preserving semantic headers', () => {
    render(<SuperadminUsersOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeTruthy();
    expect(screen.getAllByRole('cell')[0].getAttribute('data-label')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /sort by name/i }));
    expect(screen.getByText('Alpha')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('uses the source-empty message when the dataset itself has no rows', () => {
    render(<SuperadminUsersOverviewSemanticTable<Row> rowData={[]} columnDefs={columns} />);
    expect(screen.getByRole('status').textContent).toMatch(/no rows available/i);
  });

  it('filters to an empty state and resets pagination to the first page', () => {
    render(<SuperadminUsersOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    const filter = screen.getByRole('searchbox');
    fireEvent.change(filter, { target: { value: 'Active' } });
    expect(screen.getByText('Beta')).toBeTruthy();
    expect(screen.queryByText('Alpha')).toBeNull();
    fireEvent.change(filter, { target: { value: 'not-present' } });
    expect(screen.getByRole('status').textContent).toMatch(/no rows/i);
  });
});
