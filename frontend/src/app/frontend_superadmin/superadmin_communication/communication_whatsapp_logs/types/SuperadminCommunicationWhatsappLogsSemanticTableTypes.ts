// FLOW: Feature source -> superadmin_communication/communication_whatsapp_logs/types/SuperadminCommunicationWhatsappLogsSemanticTableTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Communication Semantic Table Types; defines module-owned type contracts for the named data boundary. */
import type { ReactNode } from 'react';

/**
 * Defines the public SemanticCellParams contract for communication whatsapp logs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property data Value defined by the existing feature-local contract. Declared type: T.
 * @property value Value defined by the existing feature-local contract. Declared type: V.
 * @property colDef Value defined by the existing feature-local contract. Declared type: { field?: string; }.
 */
export type SemanticCellParams<T = Record<string, unknown>, V = string | number | boolean | null | undefined> = { data: T; value: V; colDef?: { field?: string } };
/**
 * Defines the public SemanticColumnDef contract for communication whatsapp logs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property headerName Display label for the owning feature. Declared type: string.
 * @property field Value defined by the existing feature-local contract. Declared type: string.
 * @property width Value defined by the existing feature-local contract. Declared type: number.
 * @property minWidth Value defined by the existing feature-local contract. Declared type: number.
 * @property flex Value defined by the existing feature-local contract. Declared type: number.
 * @property sortable View state used to filter, sort, or page the current result set. Declared type: boolean.
 * @property hide Value defined by the existing feature-local contract. Declared type: boolean.
 * @property cellClass Value defined by the existing feature-local contract. Declared type: string | (() => string).
 * @property cellRenderer Value defined by the existing feature-local contract. Declared type: { bivarianceHack(params: SemanticCellParams<T>): ReactNode; }['bivarianceHack'].
 * @property valueGetter Value defined by the existing feature-local contract. Declared type: (params: SemanticCellParams<T>) => string | number.
 * @property valueFormatter Value defined by the existing feature-local contract. Declared type: (params: SemanticCellParams<T>) => string.
 */
export type SemanticColumnDef<T = Record<string, unknown>> = {
  headerName?: string;
  field?: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  sortable?: boolean;
  hide?: boolean;
  cellClass?: string | (() => string);
  cellRenderer?: { bivarianceHack(params: SemanticCellParams<T>) : ReactNode }['bivarianceHack'];
  valueGetter?: (params: SemanticCellParams<T>) => string | number;
  valueFormatter?: (params: SemanticCellParams<T>) => string;
  [key: string]: unknown;
};
/**
 * Defines the public SemanticTableProps contract for communication whatsapp logs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property rowData Value defined by the existing feature-local contract. Declared type: readonly T[] | null.
 * @property columnDefs Value defined by the existing feature-local contract. Declared type: readonly SemanticColumnDef<T>[] | null.
 * @property rowHeight Value defined by the existing feature-local contract. Declared type: number.
 * @property headerHeight Value defined by the existing feature-local contract. Declared type: number.
 * @property pagination Value defined by the existing feature-local contract. Declared type: boolean.
 * @property paginationPageSize View state used to filter, sort, or page the current result set. Declared type: number.
 * @property className Display label for the owning feature. Declared type: string.
 * @property theme Value defined by the existing feature-local contract. Declared type: unknown.
 * @property suppressCellFocus Value defined by the existing feature-local contract. Declared type: boolean.
 * @property suppressPaginationPanel Value defined by the existing feature-local contract. Declared type: boolean.
 * @property defaultColDef Value defined by the existing feature-local contract. Declared type: unknown.
 * @property domLayout Value defined by the existing feature-local contract. Declared type: string.
 * @property paginationPageSizeSelector View state used to filter, sort, or page the current result set. Declared type: number[].
 * @property getRowId Stable identifier for the associated record. Declared type: (params: { data: T; }) => string.
 * @property rowClassRules Value defined by the existing feature-local contract. Declared type: Record<string, (params: { data: T; }) => boolean>.
 */
export type SemanticTableProps<T> = {
  rowData?: readonly T[] | null;
  columnDefs?: readonly SemanticColumnDef<T>[] | null;
  rowHeight?: number;
  headerHeight?: number;
  pagination?: boolean;
  paginationPageSize?: number;
  className?: string;
  theme?: unknown;
  suppressCellFocus?: boolean;
  suppressPaginationPanel?: boolean;
  defaultColDef?: unknown;
  domLayout?: string;
  paginationPageSizeSelector?: number[];
  getRowId?: (params: { data: T }) => string;
  rowClassRules?: Record<string, (params: { data: T }) => boolean>;
};
