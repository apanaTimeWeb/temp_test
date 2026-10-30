'use client';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Inbox } from 'lucide-react';
import { DataGridMobileCards } from '@/components/ui/data-grid/DataGridMobileCards';
import type { DataGridCellParams, DataGridColumn, DataGridProps, ColDef, AdminUiDataGridLocale, AdminUiDataGridSortDirection } from '@/app/frontend_admin/components/ui/data-grid/types/AdminUiDataGridComponentTypes';


function readColumnValue<TRow extends object>(row: TRow, field?: Extract<keyof TRow, string>): TRow[keyof TRow] | undefined {
  return field ? row[field] : undefined;
}

const fallbackRowIdentity = new WeakMap<object, number>();
let nextFallbackRowIdentity = 1;

function getObjectFallbackIdentity(row: object): string {
  let identity = fallbackRowIdentity.get(row);
  if (!identity) {
    identity = nextFallbackRowIdentity++;
    fallbackRowIdentity.set(row, identity);
  }
  return `object:${identity}`;
}

function getStableRowIdentity<TRow extends object>(row: TRow): string {
  const identityKeys = ['id', 'uuid', 'code', 'key'] as const;
  for (const key of identityKeys) {
    if (!(key in row)) continue;
    const value = row[key as keyof TRow];
    if (typeof value === 'number' && Number.isFinite(value)) return `${key}:${String(value)}`;
    if (typeof value === 'string' && value.trim()) return `${key}:${value.trim()}`;
  }
  return getObjectFallbackIdentity(row);
}

function uniqueRowIdentities<TRow extends object>(rows: readonly TRow[], getRowId?: (row: TRow, index: number) => string): string[] {
  const candidates = rows.map((row, index) => {
    const requested = getRowId?.(row, index);
    return typeof requested === 'string' && requested.trim() ? `custom:${requested.trim()}` : getStableRowIdentity(row);
  });
  const counts = new Map<string, number>();
  for (const candidate of candidates) counts.set(candidate, (counts.get(candidate) ?? 0) + 1);
  const seen = new Map<string, number>();
  return candidates.map((candidate, index) => {
    const row = rows[index];
    const identity = counts.get(candidate) === 1 || row === undefined ? candidate : getObjectFallbackIdentity(row);
    const occurrence = seen.get(identity) ?? 0;
    seen.set(identity, occurrence + 1);
    return occurrence === 0 ? identity : `${identity}:duplicate:${occurrence}`;
  });
}

const GRID_LABELS = {
  en: { empty: 'No records found.', table: 'Data table', open: 'Open record', showing: 'Showing', of: 'of', previous: 'Previous', next: 'Next', sortBy: 'Sort by', currently: 'currently', ascending: 'ascending', descending: 'descending', cards: 'cards' },
  hi: { empty: 'कोई रिकॉर्ड नहीं मिला।', table: 'डेटा तालिका', open: 'रिकॉर्ड खोलें', showing: 'दिखाए जा रहे हैं', of: 'में से', previous: 'पिछला', next: 'अगला', sortBy: 'इसके अनुसार क्रमबद्ध करें', currently: 'वर्तमान क्रम', ascending: 'आरोही', descending: 'अवरोही', cards: 'कार्ड' },
} as const;

export function DataGrid<TRow extends object>({
  rowData = [],
  columnDefs = [],
  className = '',
  rowHeight = 48,
  pagination = true,
  pageSize = 25,
  page: controlledPage,
  onPageChange,
  getRowId,
  onRowClicked,
  emptyMessage,
  tableLabel,
  mobileOpenLabel,
  paginationLabels,
  locale: localeOverride,
}: DataGridProps<TRow>) {
  const [documentLocale, setDocumentLocale] = useState<AdminUiDataGridLocale>('en');
  useEffect(() => {
    const language = typeof document !== 'undefined' ? document.documentElement.lang.toLowerCase() : 'en';
    setDocumentLocale(language.startsWith('hi') ? 'hi' : 'en');
  }, []);
  const locale = localeOverride ?? documentLocale;
  const labels = GRID_LABELS[locale];
  const effectiveEmptyMessage = emptyMessage ?? labels.empty;
  const effectiveTableLabel = tableLabel ?? labels.table;
  const effectiveMobileOpenLabel = mobileOpenLabel ?? labels.open;
  const effectivePaginationLabels = {
    showing: paginationLabels?.showing ?? labels.showing, of: paginationLabels?.of ?? labels.of,
    previous: paginationLabels?.previous ?? labels.previous, next: paginationLabels?.next ?? labels.next,
    sortBy: paginationLabels?.sortBy ?? labels.sortBy, currently: paginationLabels?.currently ?? labels.currently,
    ascending: paginationLabels?.ascending ?? labels.ascending, descending: paginationLabels?.descending ?? labels.descending,
  };
  const [sortField, setSortField] = useState<Extract<keyof TRow, string> | null>(null);
  const [sortDirection, setSortDirection] = useState<AdminUiDataGridSortDirection>('asc');
  const [internalPage, setInternalPage] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);
  const effectivePageSize = internalPageSize;
  const page = controlledPage ?? internalPage;
  const setPage = (nextPage: number | ((currentPage: number) => number)) => {
    const resolvedPage = typeof nextPage === 'function' ? nextPage(page) : nextPage;
    if (onPageChange) onPageChange(Math.max(0, Math.floor(resolvedPage)));
    else setInternalPage(Math.max(0, Math.floor(resolvedPage)));
  };

  const sortedRows = useMemo(() => {
    if (!sortField) return [...rowData];
    return [...rowData].sort((left, right) => {
      const leftValue = left[sortField];
      const rightValue = right[sortField];
      let result = 0;
      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        result = leftValue - rightValue;
      } else if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
        result = Number(leftValue) - Number(rightValue);
      } else {
        const leftText = leftValue == null ? '' : String(leftValue);
        const rightText = rightValue == null ? '' : String(rightValue);
        result = leftText.localeCompare(rightText, undefined, { numeric: true, sensitivity: 'base' });
      }
      return sortDirection === 'asc' ? result : -result;
    });
  }, [rowData, sortDirection, sortField]);

  const safeRowHeight = Number.isFinite(rowHeight) ? Math.min(128, Math.max(24, Math.round(rowHeight))) : 48;
  const shouldVirtualize = !pagination && sortedRows.length > 50;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: shouldVirtualize ? sortedRows.length : 0,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => safeRowHeight,
    overscan: 8,
  });
  const virtualItems = shouldVirtualize ? virtualizer.getVirtualItems() : [];
  // During SSR/first paint a scroll element may not yet exist; render a bounded initial window.
  const renderedRowIndexes = shouldVirtualize
    ? (virtualItems.length > 0 ? virtualItems.map((item) => item.index) : Array.from({ length: Math.min(10, sortedRows.length) }, (_, index) => index))
    : [];

  const totalPages = pagination ? Math.max(1, Math.ceil(sortedRows.length / effectivePageSize)) : 1;
  const totalFlex = columnDefs.reduce((sum, column) => sum + (typeof column.flex === 'number' && column.flex > 0 ? column.flex : 0), 0);
  const getFlexWidthClass = (column: DataGridColumn<TRow>) => {
    if (!column.flex || column.flex <= 0 || totalFlex <= 0 || column.width) return '';
    const percent = Math.min(100, Math.max(1, Math.round((column.flex / totalFlex) * 100)));
    return `admin-grid-flex-width-${percent}`;
  };
  useEffect(() => {
    if (page < totalPages) return;
    const clampedPage = Math.max(0, totalPages - 1);
    if (onPageChange) onPageChange(clampedPage);
    else setInternalPage(clampedPage);
  }, [onPageChange, page, totalPages]);

  const currentPage = Math.min(page, totalPages - 1);
  const visibleRows = pagination ? sortedRows.slice(currentPage * effectivePageSize, (currentPage + 1) * effectivePageSize) : sortedRows;
  const sortedRowIds = useMemo(() => uniqueRowIdentities(sortedRows, getRowId), [sortedRows, getRowId]);
  const visibleRowIds = pagination ? sortedRowIds.slice(currentPage * effectivePageSize, (currentPage + 1) * effectivePageSize) : sortedRowIds;
  const renderedRows = shouldVirtualize
    ? renderedRowIndexes.map((index) => sortedRows[index]).filter((row): row is TRow => row !== undefined)
    : visibleRows;
  const renderedRowIds = shouldVirtualize
    ? renderedRowIndexes.map((index) => sortedRowIds[index] ?? `row:${index + 1}`)
    : visibleRowIds;
  const topSpacerHeight = shouldVirtualize && virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0;
  const lastVirtualItem = virtualItems[virtualItems.length - 1];
  const fallbackRenderedHeight = Math.min(10, sortedRows.length) * safeRowHeight;
  const renderedEnd = shouldVirtualize ? (lastVirtualItem?.end ?? fallbackRenderedHeight) : 0;
  const bottomSpacerHeight = shouldVirtualize ? Math.max(0, virtualizer.getTotalSize() - renderedEnd) : 0;

  function handleHeaderSort(field: Extract<keyof TRow, string>) {
    if (sortField === field) setSortDirection((current) => current === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
    setPage(0);
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: TRow) {
    if (!onRowClicked || !['Enter', ' '].includes(event.key)) return;
    const target = event.target;
    if (target instanceof HTMLElement && target !== event.currentTarget && target.closest('button, a, input, select, textarea, [role=\"button\"]')) return;
    event.preventDefault();
    onRowClicked(row);
  }

  function handleRowClick(event: MouseEvent<HTMLTableRowElement>, row: TRow) {
    if (!onRowClicked) return;
    const target = event.target;
    if (target instanceof Element && target.closest('button, a, input, select, textarea, [role="button"]')) return;
    onRowClicked(row);
  }

  const rowHeightClass = `admin-grid-row-height-${safeRowHeight}`;

  function renderCellContent(row: TRow, column: DataGridColumn<TRow>): ReactNode {
    const value = readColumnValue(row, column.field);
    const params: DataGridCellParams<TRow> = { value, data: row };
    if (column.cellRenderer) return column.cellRenderer(params);
    if (column.valueFormatter) return column.valueFormatter(params);
    if (value == null) return '—';
    if (typeof value === 'string' && value.trim().length === 0) return '—';
    return String(value);
  }

  return (
    <div ref={scrollContainerRef} className={`admin-data-grid rounded-lg border border-border bg-card ${shouldVirtualize ? 'max-h-[70vh] overflow-auto' : ''} ${className}`}>
      <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-180 border-collapse" aria-label={effectiveTableLabel} aria-rowcount={sortedRows.length + 1}>
        <thead className="bg-surface-highlight">
          <tr>
            {columnDefs.map((column, columnIndex) => (
              <th
                key={column.field ?? column.headerName}
                scope="col"
                aria-sort={column.field && sortField === column.field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                data-column-width={column.width ? `${column.width}px` : undefined}
                data-column-min-width={column.minWidth ? `${column.minWidth}px` : undefined}
                className={`h-12 whitespace-nowrap px-4 text-left text-table-header font-semibold uppercase tracking-wide text-text-secondary ${columnIndex === 0 ? 'sticky left-0 z-20 bg-surface-highlight' : ''} ${getFlexWidthClass(column)}`}
              >
                {column.field && column.sortable ? (
                  <button
                    type="button"
                    className="min-h-11 text-left text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => handleHeaderSort(column.field!)}
                    aria-label={`${effectivePaginationLabels.sortBy} ${column.headerName ?? column.field}${sortField === column.field ? `, ${effectivePaginationLabels.currently} ${sortDirection === 'asc' ? effectivePaginationLabels.ascending : effectivePaginationLabels.descending}` : ''}`}
                  >
                    {column.headerName ?? column.field} {sortField === column.field ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                  </button>
                ) : column.headerName ?? column.field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topSpacerHeight > 0 && <tr aria-hidden="true" data-virtual-spacer="top"><td colSpan={Math.max(1, columnDefs.length)} height={topSpacerHeight} className="border-0 p-0" /></tr>}
          {renderedRows.length === 0 ? (
            <tr><td colSpan={Math.max(1, columnDefs.length)} className="px-4 py-10 text-center text-body text-text-secondary"><div className="flex flex-col items-center gap-2"><Inbox aria-hidden="true" size={28} strokeWidth={1.5} className="text-text-secondary"/><p>{effectiveEmptyMessage}</p></div></td></tr>
          ) : renderedRows.map((row, index) => {
            const rowId = renderedRowIds[index];
            const rowClickable = Boolean(onRowClicked);
            return (
              <tr
                key={rowId}
                ref={shouldVirtualize ? virtualizer.measureElement : undefined}
                data-index={shouldVirtualize ? renderedRowIndexes[index] : undefined}
                aria-rowindex={shouldVirtualize ? (renderedRowIndexes[index] ?? index) + 2 : undefined}
                data-row-identity={rowId}
                data-row-height={`${safeRowHeight}px`}
                className={`border-t border-border bg-card even:bg-surface-zebra/30 motion-safe:transition-colors hover:bg-surface-hover focus-within:bg-surface-hover ${rowHeightClass} ${rowClickable ? 'cursor-pointer' : ''}`}
                tabIndex={rowClickable ? 0 : undefined}
                onClick={rowClickable ? (event) => handleRowClick(event, row) : undefined}
                onKeyDown={rowClickable ? (event) => handleRowKeyDown(event, row) : undefined}
              >
                {columnDefs.map((column, columnIndex) => {
                  const content = renderCellContent(row, column);
                  return (
                    <td
                      key={column.field ?? column.headerName}
                      data-column-width={column.width ? `${column.width}px` : undefined}
                      data-column-min-width={column.minWidth ? `${column.minWidth}px` : undefined}
                      className={`px-4 text-body text-text-primary ${columnIndex === 0 ? 'sticky left-0 z-10 bg-card' : ''} ${getFlexWidthClass(column)}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {bottomSpacerHeight > 0 && <tr aria-hidden="true" data-virtual-spacer="bottom"><td colSpan={Math.max(1, columnDefs.length)} height={bottomSpacerHeight} className="border-0 p-0" /></tr>}
        </tbody>
      </table>
      </div>
      <DataGridMobileCards
        visibleRows={renderedRows}
        rowIds={renderedRowIds}
        rowIndexes={shouldVirtualize ? renderedRowIndexes : undefined}
        measureRow={shouldVirtualize ? virtualizer.measureElement : undefined}
        topSpacerHeight={topSpacerHeight}
        bottomSpacerHeight={bottomSpacerHeight}
        columnDefs={columnDefs}
        tableLabel={effectiveTableLabel}
        mobileOpenLabel={effectiveMobileOpenLabel}
        emptyMessage={effectiveEmptyMessage}
        cardLabel={labels.cards}
        onRowClicked={onRowClicked}
        renderCellContent={renderCellContent}
      />
      {pagination && sortedRows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-caption text-text-secondary">
          <span>{effectivePaginationLabels.showing} {currentPage * effectivePageSize + 1}–{Math.min((currentPage + 1) * effectivePageSize, sortedRows.length)} {effectivePaginationLabels.of} {sortedRows.length}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <label htmlFor="admin-data-grid-page-size" className="text-xs text-text-secondary whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="admin-data-grid-page-size"
                value={effectivePageSize}
                onChange={(e) => {
                  setInternalPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="rounded border border-border bg-input px-2 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="min-h-9 rounded-md border border-border px-3 py-1.5 text-xs text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-text-disabled" disabled={currentPage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>{effectivePaginationLabels.previous}</button>
              <span className="text-xs text-text-secondary">Page {currentPage + 1} of {totalPages}</span>
              <button type="button" className="min-h-9 rounded-md border border-border px-3 py-1.5 text-xs text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-text-disabled" disabled={currentPage >= totalPages - 1} onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}>{effectivePaginationLabels.next}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataGrid;


export type { DataGridCellParams, DataGridColumn, DataGridProps, ColDef };
