import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DataGrid } from '@/components/ui/data-grid/DataGrid';
import { DataGridMobileCards } from '@/components/ui/data-grid/DataGridMobileCards';
import type { DataGridColumn } from '@/components/ui/data-grid/DataGrid';


interface DataGridTestRecord {
  id: string;
  name: string;
  status: string;
  amount: number;
}

const records: DataGridTestRecord[] = [
  { id: 'record-001', name: 'Demo member', status: 'Active', amount: 12500 },
];

const columns: readonly DataGridColumn<DataGridTestRecord>[] = [
  { field: 'name', headerName: 'Member', sortable: true },
  { field: 'status', headerName: 'Status' },
  { field: 'amount', headerName: 'Amount', valueFormatter: ({ value }) => `INR ${String(value ?? 0)}` },
];

describe('DataGrid responsive presentation', () => {
  it('renders every column in the mobile card-stack and invokes the row action', () => {
    const onRowClicked = vi.fn();
    render(
      <DataGrid
        rowData={records}
        columnDefs={columns}
        tableLabel="Members table"
        onRowClicked={onRowClicked}
      />,
    );

    const mobileRegion = screen.getByRole('region', { name: 'Members table cards' });
    expect(within(mobileRegion).getByText('Demo member')).toBeTruthy();
    expect(within(mobileRegion).getByText('Active')).toBeTruthy();
    expect(within(mobileRegion).getByText('INR 12500')).toBeTruthy();
    fireEvent.click(within(mobileRegion).getByRole('button', { name: 'Open record: Demo member' }));
    expect(onRowClicked).toHaveBeenCalledWith(records[0]);
  });

  it('requests controlled pagination changes from its owner', () => {
    const onPageChange = vi.fn();
    const manyRecords = Array.from({ length: 11 }, (_, index) => ({ id: `record-${index + 1}`, name: `Member ${index + 1}`, status: 'Active', amount: index * 100 }));
    render(<DataGrid rowData={manyRecords} columnDefs={columns} pagination pageSize={10} page={0} onPageChange={onPageChange} tableLabel="Controlled table" />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('keeps the desktop table semantic and named', () => {
    render(<DataGrid rowData={records} columnDefs={columns} tableLabel="Members table" />);
    expect(screen.getByRole('table', { name: 'Members table' })).toBeTruthy();
  });

  it('opens desktop records by pointer and keyboard without activating nested controls', () => {
    const onRowClicked = vi.fn();
    render(<DataGrid rowData={records} columnDefs={columns} onRowClicked={onRowClicked} tableLabel="Members table" />);
    const table = screen.getByRole('table', { name: 'Members table' });
    const row = within(table).getByText('Demo member').closest('tr');
    expect(row).toBeTruthy();
    fireEvent.click(row!);
    expect(onRowClicked).toHaveBeenLastCalledWith(records[0]);
    fireEvent.keyDown(row!, { key: 'Enter' });
    expect(onRowClicked).toHaveBeenLastCalledWith(records[0]);
    fireEvent.keyDown(row!, { key: ' ' });
    expect(onRowClicked).toHaveBeenLastCalledWith(records[0]);
    expect(onRowClicked).toHaveBeenCalledTimes(3);
  });


  it('does not activate the row when Enter or Space targets a nested action button', () => {
    const onRowClicked = vi.fn();
    const actionColumns: readonly DataGridColumn<DataGridTestRecord>[] = [
      { field: 'name', headerName: 'Member' },
      { field: 'status', headerName: 'Status', cellRenderer: () => <button type="button">Open action</button> },
    ];
    render(<DataGrid rowData={records} columnDefs={actionColumns} onRowClicked={onRowClicked} tableLabel="Action records" />);
    const action = within(screen.getByRole('table', { name: 'Action records' })).getByRole('button', { name: 'Open action' });
    fireEvent.keyDown(action, { key: 'Enter' });
    fireEvent.keyDown(action, { key: ' ' });
    fireEvent.click(action);
    expect(onRowClicked).not.toHaveBeenCalled();
  });
});


describe('DataGrid localized defaults and row identity', () => {
  it('uses Hindi visible and accessible defaults when Hindi locale is active', () => {
    const manyRows = Array.from({ length: 11 }, (_, index) => ({ id: `hi-${index}`, name: `सदस्य ${index}`, status: 'सक्रिय', amount: index }));
    render(<DataGrid rowData={manyRows} columnDefs={columns} locale="hi" pagination pageSize={10} />);
    expect(screen.getByRole('table', { name: 'डेटा तालिका' })).toBeTruthy();
    expect(screen.getByText(/दिखाए जा रहे हैं/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'अगला' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /इसके अनुसार क्रमबद्ध करें/ })).toBeTruthy();
  });

  it('localizes the empty state and mobile row-action defaults in Hindi', () => {
    render(<DataGrid rowData={[]} columnDefs={columns} locale="hi" />);
    expect(screen.getAllByText('कोई रिकॉर्ड नहीं मिला।')[0]).toBeTruthy();
    expect(screen.getByRole('table', { name: 'डेटा तालिका' })).toBeTruthy();
  });

  it('keeps duplicate and blank row identifiers collision-safe', () => {
    const rows = [
      { id: '', name: 'First', status: 'Active', amount: 1 },
      { id: '', name: 'Second', status: 'Active', amount: 2 },
      { id: 'duplicate', name: 'Third', status: 'Active', amount: 3 },
      { id: 'duplicate', name: 'Fourth', status: 'Active', amount: 4 },
    ];
    const { container, rerender } = render(<DataGrid rowData={rows} columnDefs={columns} pagination={false} tableLabel="Identity table" />);
    const firstKeys = Array.from(container.querySelectorAll('tbody tr[data-row-identity]')).map((row) => row.getAttribute('data-row-identity'));
    expect(firstKeys).toHaveLength(4);
    expect(new Set(firstKeys).size).toBe(4);
    expect(within(screen.getByRole('table', { name: 'Identity table' })).getAllByRole('row')).toHaveLength(5);
    const firstRow = rows[0];
    if (!firstRow) throw new Error('Expected the first identity row to exist.');
    firstRow.name = 'First updated';
    rerender(<DataGrid rowData={[...rows]} columnDefs={columns} pagination={false} tableLabel="Identity table" />);
    expect(within(screen.getByRole('table', { name: 'Identity table' })).getAllByRole('row')).toHaveLength(5);
    const secondKeys = Array.from(container.querySelectorAll('tbody tr[data-row-identity]')).map((row) => row.getAttribute('data-row-identity'));
    expect(new Set(secondKeys).size).toBe(4);
    expect(secondKeys).toEqual(firstKeys);
  });
  it('uses an en-dash for nullish and blank strings while preserving 0 and false', () => {
    const fallbackColumns: readonly DataGridColumn<{ id: string; blank: string; whitespace: string; missing: string | null; amount: number; enabled: boolean }>[] = [
      { field: 'blank', headerName: 'Blank' },
      { field: 'whitespace', headerName: 'Whitespace' },
      { field: 'missing', headerName: 'Missing' },
      { field: 'amount', headerName: 'Amount' },
      { field: 'enabled', headerName: 'Enabled' },
    ];
    const rows = [{ id: 'fallback-row', blank: '', whitespace: '  ', missing: null, amount: 0, enabled: false }];
    render(<DataGrid rowData={rows} columnDefs={fallbackColumns} tableLabel="Fallback table" />);
    const table = screen.getByRole('table', { name: 'Fallback table' });
    expect(within(table).getAllByText('—')).toHaveLength(3);
    expect(within(table).getByText('0')).toBeTruthy();
    expect(within(table).getByText('false')).toBeTruthy();
  });

  it('bounds the rendered row window for unpaginated data larger than fifty rows', () => {
    const manyRecords = Array.from({ length: 120 }, (_, index) => ({ id: `large-${index}`, name: `Large member ${index}`, status: 'Active', amount: index }));
    render(<DataGrid rowData={manyRecords} columnDefs={columns} pagination={false} tableLabel="Large records" />);
    const table = screen.getByRole('table', { name: 'Large records' });
    const renderedTableRows = within(table).getAllByRole('row').length;
    expect(renderedTableRows).toBeGreaterThan(1);
    expect(renderedTableRows).toBeLessThan(121);
    const mobileRegion = screen.getByRole('region', { name: 'Large records cards' });
    const mobileRows = Array.from(mobileRegion.querySelectorAll('[data-row-identity]'));
    expect(mobileRows.length).toBeLessThan(120);
    expect(mobileRows.every((row) => row.hasAttribute('data-index'))).toBe(true);
    expect(mobileRegion.querySelector('[data-virtual-spacer="bottom"]')).toBeTruthy();
  });

});


describe('DataGrid mobile virtualization contract', () => {
  it('renders both spacer sizes and measures virtual mobile cards by stable row index', () => {
    const measureRow = vi.fn();
    render(
      <DataGridMobileCards
        visibleRows={records}
        rowIds={['record-001']}
        rowIndexes={[4]}
        measureRow={measureRow}
        topSpacerHeight={120}
        bottomSpacerHeight={240}
        columnDefs={columns}
        tableLabel="Members table"
        mobileOpenLabel="Open record"
        emptyMessage="No records"
        cardLabel="cards"
        renderCellContent={() => 'cell value'}
      />,
    );

    const region = screen.getByRole('region', { name: 'Members table cards' });
    expect(region.querySelector('[data-virtual-spacer="top"]')?.getAttribute('height')).toBe('120');
    expect(region.querySelector('[data-virtual-spacer="bottom"]')?.getAttribute('height')).toBe('240');
    const row = region.querySelector('[data-row-identity="record-001"]');
    expect(row?.getAttribute('data-index')).toBe('4');
    expect(measureRow).toHaveBeenCalledWith(row);
  });
});
