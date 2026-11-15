'use client';

import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Wrench,
  CheckCircle2,
  Eye,
  Trash2,
  AlertTriangle,
  Calendar,
  Building2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import ManagerAssetsMaintenanceEmptyState from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/components/ManagerAssetsMaintenanceEmptyState';

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
              paginated.map((l) => {
                const priorityBadge =
                  l.priority === 'emergency'
                    ? { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' }
                    : l.priority === 'urgent'
                    ? { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' }
                    : { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' };

                return (
                  <tr
                    key={l.id}
                    className="hover:bg-surface-hover/70 transition-colors group h-14"
                  >
                    {/* Asset Name + Priority */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary text-xs">{l.assetName}</span>
                        {l.priority && (
                          <span
                            className={`inline-flex items-center gap-1 w-fit mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase border ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border}`}
                          >
                            {l.priority === 'emergency' ? (
                              <AlertTriangle size={9} />
                            ) : (
                              <Clock size={9} />
                            )}
                            {l.priority}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Issue Description + Type */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="flex flex-col">
                        <span className="text-xs text-primary font-medium line-clamp-1" title={l.issue}>
                          {l.issue}
                        </span>
                        {l.type && (
                          <span className="text-[10px] text-secondary capitalize mt-0.5">
                            {l.type} maintenance
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Reported Date */}
                    <td className="py-3 px-4 text-xs text-secondary whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-secondary/70 shrink-0" />
                        <span>{l.reportedDate}</span>
                      </div>
                    </td>

                    {/* Scheduled Date */}
                    <td className="py-3 px-4 text-xs text-secondary whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-secondary/70 shrink-0" />
                        <span>{l.scheduledDate}</span>
                      </div>
                    </td>

                    {/* Vendor */}
                    <td className="py-3 px-4 text-xs text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={12} className="text-secondary/70 shrink-0" />
                        <span className="truncate max-w-[120px]" title={l.vendor}>
                          {l.vendor}
                        </span>
                      </div>
                    </td>

                    {/* Cost */}
                    <td className="py-3 px-4 text-right font-semibold text-xs text-emerald-400 whitespace-nowrap">
                      {formatCurrency(l.cost)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          l.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : l.status === 'in-progress'
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {l.status === 'pending' ? (
                          <>
                            <Clock size={12} aria-hidden="true" />
                            <span>{tManagerUi('pending')}</span>
                          </>
                        ) : l.status === 'in-progress' ? (
                          <>
                            <Wrench size={12} aria-hidden="true" />
                            <span>{tManagerUi('in_progress')}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} aria-hidden="true" />
                            <span>{tManagerUi('completed')}</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* View Details Icon Button */}
                        {onViewDetails && (
                          <button
                            type="button"
                            onClick={() => onViewDetails(l)}
                            className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 transition-colors cursor-pointer"
                            title="View Ticket Details"
                            aria-label={`View details for ${l.assetName}`}
                          >
                            <Eye size={15} />
                          </button>
                        )}

                        {/* Advance Status Button */}
                        {l.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(l.id, l.status)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                              l.status === 'pending'
                                ? 'bg-amber-500 hover:bg-amber-600 !text-black'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                            title={
                              l.status === 'pending'
                                ? 'Start work on maintenance order'
                                : 'Mark maintenance order as completed'
                            }
                          >
                            {l.status === 'pending' ? (
                              <>
                                <Wrench size={12} />
                                <span>Start Work</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={12} />
                                <span>Complete</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Delete Button */}
                        {onDeleteLog && (
                          <button
                            type="button"
                            onClick={() => onDeleteLog(l.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition-colors cursor-pointer"
                            title="Delete maintenance record"
                            aria-label={`Delete record for ${l.assetName}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-secondary bg-surface-highlight/30">
          <span>
            Showing <strong className="text-primary font-semibold">{startItem}</strong>–
            <strong className="text-primary font-semibold">{endItem}</strong> of{' '}
            <strong className="text-primary font-semibold">{totalRows}</strong> results
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label htmlFor="rows-per-page-assets-maintenance" className="text-xs text-secondary whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="rows-per-page-assets-maintenance"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                disabled={effectivePage <= 0}
                onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
              >
                Previous
              </button>
              <span className="text-xs text-secondary px-1.5">
                Page <strong className="text-primary font-semibold">{effectivePage + 1}</strong> of{' '}
                <strong className="text-primary font-semibold">{pageCount}</strong>
              </span>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

export default ManagerAssetsMaintenanceTable;
