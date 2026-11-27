'use client';

import ManagerAssetsMaintenanceEmptyState from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceEmptyState';
import { ManagerAssetsMaintenanceTablePagination } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceTablePagination';
import { ManagerAssetsMaintenanceTableRow } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceTableRow';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type MaintenanceSortField =
  | 'assetName'
  | 'issue'
  | 'reportedDate'
  | 'scheduledDate'
  | 'vendor'
  | 'cost'
  | 'status';

export type MaintenancePriority = 'routine' | 'urgent' | 'emergency';
export type MaintenanceType = 'preventive' | 'breakdown' | 'inspection';

export interface MaintenanceLogItem {
  id: number;
  assetName: string;
  issue: string;
  reportedDate: string;
  scheduledDate: string;
  vendor: string;
  cost: number;
  status: 'pending' | 'in-progress' | 'completed';
  priority?: MaintenancePriority;
  type?: MaintenanceType;
  autoPostToExpenses?: boolean;
  expensePostedId?: number | null;
  expensePaymentSource?: 'petty_cash' | 'bank_direct';
}

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
  onViewDetails?: (log: MaintenanceLogItem) => void;
  onDeleteLog?: (id: number) => void;
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
  onViewDetails,
  onDeleteLog,
  page,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: ManagerAssetsMaintenanceTableProps) {
  const tManagerUi = useTranslations('manager.manager_assets_maintenance.ui');
  const effectivePage = Math.min(page, Math.max(0, pageCount - 1));
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const renderSortableHeader = (
    field: MaintenanceSortField,
    label: string,
    align: 'left' | 'right' = 'left'
  ) => {
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
          aria-pressed={isActive}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 cursor-pointer ${
            align === 'right' ? 'ml-auto' : ''
          }`}
          aria-label={`${label}, sort ${
            isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'
          }`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown
              size={14}
              className="text-secondary opacity-40 group-hover:opacity-100 transition-colors shrink-0"
              aria-hidden="true"
            />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-highlight/70 text-xs uppercase text-secondary font-semibold">
              {renderSortableHeader('assetName', tManagerUi('asset'), 'left')}
              {renderSortableHeader('issue', tManagerUi('issue'), 'left')}
              {renderSortableHeader('reportedDate', tManagerUi('reported'), 'left')}
              {renderSortableHeader('scheduledDate', tManagerUi('scheduled'), 'left')}
              {renderSortableHeader('vendor', tManagerUi('vendor'), 'left')}
              {renderSortableHeader('cost', tManagerUi('cost_inr'), 'right')}
              {renderSortableHeader('status', tManagerUi('status'), 'left')}
              <th scope="col" className="text-right py-3 px-4">
                {tManagerUi('action')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCount === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center">
                  <ManagerAssetsMaintenanceEmptyState
                    title={
                      searchQuery
                        ? 'No maintenance records matching your search query.'
                        : tManagerUi('no_maintenance_records_found')
                    }
                  />
                </td>
              </tr>
            ) : (
              paginated.map((l) => (
                <ManagerAssetsMaintenanceTableRow
                  key={l.id}
                  logItem={l}
                  formatCurrency={formatCurrency}
                  onUpdateStatus={onUpdateStatus}
                  onViewDetails={onViewDetails}
                  onDeleteLog={onDeleteLog}
                  statusLabels={{
                    pending: tManagerUi('pending'),
                    inProgress: tManagerUi('in_progress'),
                    completed: tManagerUi('completed'),
                  }}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <ManagerAssetsMaintenanceTablePagination
        totalRows={totalRows}
        startItem={startItem}
        endItem={endItem}
        effectivePage={effectivePage}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

export default ManagerAssetsMaintenanceTable;
