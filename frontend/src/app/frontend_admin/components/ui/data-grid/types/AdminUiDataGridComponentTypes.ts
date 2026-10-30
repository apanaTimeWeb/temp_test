import type { ReactNode } from 'react';

export interface DataGridCellParams<TRow extends object> {
  value: TRow[keyof TRow] | undefined;
  data: TRow;
}

export interface DataGridColumn<TRow extends object> {
  field?: Extract<keyof TRow, string>;
  headerName?: string;
  width?: number;
  flex?: number;
  minWidth?: number;
  sortable?: boolean;
  valueFormatter?: (params: DataGridCellParams<TRow>) => ReactNode;
  cellRenderer?: (params: DataGridCellParams<TRow>) => ReactNode;
}

export type AdminUiDataGridLocale = 'en' | 'hi';

export interface DataGridProps<TRow extends object> {
  rowData?: readonly TRow[];
  columnDefs?: readonly DataGridColumn<TRow>[];
  className?: string;
  rowHeight?: number;
  pagination?: boolean;
  pageSize?: 10 | 25 | 50;
  /** Optional controlled pagination state; callers can persist this in the URL. */
  page?: number;
  /** Callback for controlled pagination. */
  onPageChange?: (page: number) => void;
  getRowId?: (row: TRow, index: number) => string;
  onRowClicked?: (row: TRow) => void;
  emptyMessage?: string;
  tableLabel?: string;
  mobileOpenLabel?: string;
  /** Optional locale override; defaults to the document language after mount. */
  locale?: AdminUiDataGridLocale;
  paginationLabels?: { showing: string; of: string; previous: string; next: string; sortBy?: string; currently?: string; ascending?: string; descending?: string };
}

export type ColDef<TRow extends object> = DataGridColumn<TRow>;

export interface DataGridMobileCardsProps<TRow extends object> {
  visibleRows: readonly TRow[];
  rowIds: readonly string[];
  rowIndexes?: readonly number[];
  measureRow?: (element: Element | null) => void;
  topSpacerHeight?: number;
  bottomSpacerHeight?: number;
  columnDefs: readonly DataGridColumn<TRow>[];
  tableLabel: string;
  mobileOpenLabel: string;
  emptyMessage: string;
  cardLabel: string;
  onRowClicked?: (row: TRow) => void;
  renderCellContent: (row: TRow, column: DataGridColumn<TRow>) => ReactNode;
}

export type AdminUiDataGridSortDirection = 'asc' | 'desc';
