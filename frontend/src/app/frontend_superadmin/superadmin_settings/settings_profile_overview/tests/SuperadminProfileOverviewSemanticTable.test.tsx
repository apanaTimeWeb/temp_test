// RESPONSIBILITY: Define source-level test coverage for settings profile overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_profile_overview/tests/SuperadminProfileOverviewSemanticTable.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SuperadminProfileOverviewSemanticTable, { type SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewSemanticTable';

type Row = { id: string; name: string; status: string };
const rows: Row[] = [
  { id: 'row-b', name: 'Beta', status: 'Active' },
  { id: 'row-a', name: 'Alpha', status: 'Paused' },
];
const columns: SemanticColumnDef<Row>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'status', headerName: 'Status' },
];

describe('SuperadminProfileOverviewSemanticTable', () => {
  it('sorts and paginates while preserving semantic headers', () => {
    render(<SuperadminProfileOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeTruthy();
    expect(screen.getAllByRole('cell')[0].getAttribute('data-label')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /sort by name/i }));
    expect(screen.getByText('Alpha')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('filters to an empty state and resets pagination to the first page', () => {
    render(<SuperadminProfileOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    const filter = screen.getByRole('searchbox');
    fireEvent.change(filter, { target: { value: 'Active' } });
    expect(screen.getByText('Beta')).toBeTruthy();
    expect(screen.queryByText('Alpha')).toBeNull();
    fireEvent.change(filter, { target: { value: 'not-present' } });
    expect(screen.getByRole('status').textContent).toMatch(/no rows/i);
  });


  it('renders an unfiltered empty-data message', () => {
    render(<SuperadminProfileOverviewSemanticTable<Row> rowData={[]} columnDefs={columns} hideFilter />);
    expect(screen.getByRole('status').textContent).toMatch(/available|उपलब्ध/i);
  });

  it('renders boolean false as a visible negative value', () => {
    type BooleanRow = { id: string; enabled: boolean };
    const booleanColumns: SemanticColumnDef<BooleanRow>[] = [{ field: 'enabled', headerName: 'Enabled' }];
    render(<SuperadminProfileOverviewSemanticTable<BooleanRow> rowData={[{ id: 'boolean-row', enabled: false }]} columnDefs={booleanColumns} hideFilter />);
    expect(screen.getByRole('cell').textContent).toMatch(/no|नहीं/i);
  });
});
