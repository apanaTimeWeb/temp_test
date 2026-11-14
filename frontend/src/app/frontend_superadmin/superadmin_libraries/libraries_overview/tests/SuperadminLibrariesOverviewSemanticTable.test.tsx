// RESPONSIBILITY: Define source-level test coverage for libraries overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_libraries/libraries_overview/tests/SuperadminLibrariesOverviewSemanticTable.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SuperadminLibrariesOverviewSemanticTable, { type SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewSemanticTable';

type Row = { id: string; name: string; status: string };
const rows: Row[] = [
  { id: 'row-b', name: 'Beta', status: 'Active' },
  { id: 'row-a', name: 'Alpha', status: 'Paused' },
];
const columns: SemanticColumnDef<Row>[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'status', headerName: 'Status' },
];

describe('SuperadminLibrariesOverviewSemanticTable', () => {
  it('renders semantic headers, sorts rows, and paginates with stable row identity', () => {
    render(<SuperadminLibrariesOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeTruthy();
    expect(screen.getAllByRole('cell')[0].getAttribute('data-label')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /sort by name/i }));
    expect(screen.getByText('Alpha')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('supports keyboard activation for an interactive row', () => {
    const onRowClick = vi.fn();
    render(<SuperadminLibrariesOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} getRowId={({ data }) => data.id} onRowClick={onRowClick} hideFilter />);
    const row = screen.getByText('Beta').closest('tr');
    expect(row).toBeTruthy();
    if (row) fireEvent.keyDown(row, { key: 'Enter' });
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });


  it('resets to the first page after filtering and exposes an empty state', () => {
    render(<SuperadminLibrariesOverviewSemanticTable<Row> rowData={rows} columnDefs={columns} pagination paginationPageSize={1} getRowId={({ data }) => data.id} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Active' } });
    expect(screen.getByText('Beta')).toBeTruthy();
    expect(screen.queryByText('Alpha')).toBeNull();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'no-match' } });
    expect(screen.getByRole('status').textContent).toMatch(/no rows/i);
  });


  it('renders an unfiltered empty-data message', () => {
    render(<SuperadminLibrariesOverviewSemanticTable<Row> rowData={[]} columnDefs={columns} hideFilter />);
    expect(screen.getByRole('status').textContent).toMatch(/available|उपलब्ध/i);
  });

  it('renders boolean false as a visible negative value', () => {
    type BooleanRow = { id: string; enabled: boolean };
    const booleanColumns: SemanticColumnDef<BooleanRow>[] = [{ field: 'enabled', headerName: 'Enabled' }];
    render(<SuperadminLibrariesOverviewSemanticTable<BooleanRow> rowData={[{ id: 'boolean-row', enabled: false }]} columnDefs={booleanColumns} hideFilter />);
    expect(screen.getByRole('cell').textContent).toMatch(/no|नहीं/i);
  });
});
