// Responsibility: render responsive mobile cards for the shared DataGrid primitive.
import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import type { DataGridColumn } from '@/components/ui/data-grid/DataGrid';
import type { DataGridMobileCardsProps } from '@/app/frontend_admin/components/ui/data-grid/types/AdminUiDataGridComponentTypes';


export function DataGridMobileCards<TRow extends object>({
  visibleRows,
  rowIds,
  rowIndexes,
  measureRow,
  topSpacerHeight = 0,
  bottomSpacerHeight = 0,
  columnDefs,
  tableLabel,
  mobileOpenLabel,
  emptyMessage,
  cardLabel,
  onRowClicked,
  renderCellContent,
}: DataGridMobileCardsProps<TRow>) {
  return (
    <div role="region" className="grid gap-3 p-3 md:hidden" aria-label={`${tableLabel} ${cardLabel}`}>
      {topSpacerHeight > 0 && <svg aria-hidden="true" focusable="false" data-virtual-spacer="top" width="1" height={topSpacerHeight} className="block" />}
      {visibleRows.length === 0 ? (
        <div role="status" className="flex flex-col items-center gap-2 rounded-lg border border-border px-4 py-10 text-center text-body text-text-secondary">
          <Inbox aria-hidden="true" size={28} strokeWidth={1.5} className="text-text-secondary" />
          <p>{emptyMessage}</p>
        </div>
      ) : visibleRows.map((row, index) => {
        const rowId = rowIds[index] ?? `row:${index + 1}`;
        const firstColumn = columnDefs[0];
        const primaryValue = firstColumn ? row[firstColumn.field as keyof TRow] : undefined;
        return (
          <article
            key={`mobile-${rowId}`}
            ref={rowIndexes ? measureRow : undefined}
            data-index={rowIndexes ? rowIndexes[index] : undefined}
            data-row-identity={rowId}
            className="min-w-0 rounded-lg border border-border bg-card p-4 shadow-card"
          >
            {firstColumn && (
              <div className="mb-3 border-b border-border pb-3">
                <p className="text-caption font-semibold uppercase tracking-wide text-text-secondary">{firstColumn.headerName ?? firstColumn.field ?? tableLabel}</p>
                <div className="mt-1 break-words text-body font-semibold text-text-primary">{renderCellContent(row, firstColumn)}</div>
              </div>
            )}
            <dl className="grid min-w-0 grid-cols-1 gap-3">
              {columnDefs.slice(firstColumn ? 1 : 0).map((column) => (
                <div key={column.field ?? column.headerName ?? 'unnamed-column'} className="grid min-w-0 grid-cols-[minmax(6rem,0.8fr)_minmax(0,1.2fr)] gap-3">
                  <dt className="break-words text-caption font-medium text-text-secondary">{column.headerName ?? column.field ?? tableLabel}</dt>
                  <dd className="min-w-0 break-words text-body text-text-primary">{renderCellContent(row, column)}</dd>
                </div>
              ))}
            </dl>
            {onRowClicked && (
              <div className="mt-4 border-t border-border pt-3">
                <button type="button" className="min-h-11 w-full rounded-md border border-border px-3 py-2 text-body font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onRowClicked(row)} aria-label={`${mobileOpenLabel}: ${String(primaryValue ?? index + 1)}`}>
                  {mobileOpenLabel}
                </button>
              </div>
            )}
          </article>
        );
      })}
    {bottomSpacerHeight > 0 && <svg aria-hidden="true" focusable="false" data-virtual-spacer="bottom" width="1" height={bottomSpacerHeight} className="block" />}
    </div>
  );
}


export type { DataGridMobileCardsProps };
