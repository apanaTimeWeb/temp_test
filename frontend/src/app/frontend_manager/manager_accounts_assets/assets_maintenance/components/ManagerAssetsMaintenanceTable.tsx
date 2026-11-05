'use client';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ManagerAssetsMaintenanceEmptyState from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceEmptyState';

export type MaintenanceSortField = 'assetName' | 'issue' | 'reportedDate' | 'scheduledDate' | 'vendor' | 'cost' | 'status';

export interface MaintenanceLogItem {
  id: number;
  assetName: string;
  issue: string;
  reportedDate: string;
  scheduledDate: string;
  vendor: string;
  cost: number;
  status: 'pending' | 'in-progress' | 'completed';
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'fin-badge--warning',
  'in-progress': 'fin-badge--info',
  completed: 'fin-badge--success',
};

interface ManagerAssetsMaintenanceTableProps {
  paginated: MaintenanceLogItem[];
  totalRows: number;
  filteredCount: number;
  searchQuery: string;
  sortField: MaintenanceSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: MaintenanceSortField) => void;
  formatCurrency: (val: number) => string;
  onUpdateStatus: (id: number, currentStatus: string) => void;
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function ManagerAssetsMaintenanceTable({
  paginated,
  totalRows,
  filteredCount,
  searchQuery,
  sortField,
  sortDirection,
  onToggleSort,
  formatCurrency,
  onUpdateStatus,
  page,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: ManagerAssetsMaintenanceTableProps) {
  const tManagerUi = useTranslations('manager.manager_assets_maintenance.ui');
  const effectivePage = Math.min(page, pageCount - 1);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const renderSortableHeader = (field: MaintenanceSortField, label: string, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={14} className="text-secondary/40 group-hover:text-secondary transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="fin-card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
            {renderSortableHeader('assetName', tManagerUi('asset'), 'left')}
            {renderSortableHeader('issue', tManagerUi('issue'), 'left')}
            {renderSortableHeader('reportedDate', tManagerUi('reported'), 'left')}
            {renderSortableHeader('scheduledDate', tManagerUi('scheduled'), 'left')}
            {renderSortableHeader('vendor', tManagerUi('vendor'), 'left')}
            {renderSortableHeader('cost', tManagerUi('cost_inr'), 'right')}
            {renderSortableHeader('status', tManagerUi('status'), 'left')}
            <th scope="col" className="text-right py-3 px-4">{tManagerUi('action')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredCount === 0 ? (
            <tr>
              <td colSpan={8}>
                <ManagerAssetsMaintenanceEmptyState
                  title={searchQuery ? 'No maintenance records matching your search query.' : tManagerUi('no_maintenance_records_found')}
                />
              </td>
            </tr>
          ) : (
            paginated.map((l) => (
              <tr key={l.id} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
                <td className="py-3 px-4 fin-cell-name">{l.assetName}</td>
                <td className="py-3 px-4 fin-text-body">{l.issue}</td>
                <td className="py-3 px-4 fin-cell-subtext">{l.reportedDate}</td>
                <td className="py-3 px-4 fin-cell-subtext">{l.scheduledDate}</td>
                <td className="py-3 px-4 fin-cell-subtext">{l.vendor}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(l.cost)}</td>
                <td className="py-3 px-4">
                  <span className={`fin-badge ${STATUS_BADGE[l.status]}`}>
                    {l.status === 'pending' ? tManagerUi('pending') : l.status === 'in-progress' ? tManagerUi('in_progress') : l.status === 'completed' ? tManagerUi('completed') : l.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {l.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(l.id, l.status)}
                      className="fin-badge fin-badge--success cursor-pointer hover:opacity-90"
                      title="Advance maintenance status"
                    >
                      {l.status === 'pending' ? 'Start Work' : 'Complete'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
          <span>
            Showing {startItem}–{endItem} of {totalRows} results
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <label htmlFor="rows-per-page-assets-maintenance" className="text-xs text-secondary whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="rows-per-page-assets-maintenance"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="mgr-btn-ghost mgr-btn-sm"
                disabled={effectivePage <= 0}
                onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
              >
                Previous
              </button>
              <span className="text-xs text-secondary px-1">
                Page {effectivePage + 1} of {pageCount}
              </span>
              <button
                type="button"
                className="mgr-btn-ghost mgr-btn-sm"
                disabled={effectivePage >= pageCount - 1}
                onClick={() => onPageChange(Math.min(pageCount - 1, effectivePage + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

