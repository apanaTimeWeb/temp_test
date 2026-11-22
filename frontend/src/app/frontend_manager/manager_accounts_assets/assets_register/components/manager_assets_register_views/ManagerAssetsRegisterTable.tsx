'use client';

import { ManagerAssetsRegisterEmptyState } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_empty_states/ManagerAssetsRegisterEmptyState';
import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import {
Archive,
ArrowDown,
ArrowUp,
ArrowUpDown,
Calendar,
CheckCircle2,
Eye,
MapPin,
Package,
Trash2,
Wrench
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export type AssetSortField =
  | 'name'
  | 'category'
  | 'purchaseDate'
  | 'purchaseValue'
  | 'currentValue'
  | 'location'
  | 'status';

interface ManagerAssetsRegisterTableProps {
  paginated: ManagerAssetsRegisterAsset[];
  totalRows: number;
  filteredCount: number;
  searchQuery: string;
  sortField: AssetSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: AssetSortField) => void;
  formatCurrency: (val: number) => string;
  categoryLabel: (category: string) => string;
  statusLabel: (status: ManagerAssetsRegisterAsset['status']) => string;
  onViewDetails?: (asset: ManagerAssetsRegisterAsset) => void;
  onToggleStatus?: (asset: ManagerAssetsRegisterAsset) => void;
  onDeleteAsset?: (id: number) => void;
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
}

export function ManagerAssetsRegisterTable({
  paginated,
  totalRows,
  filteredCount,
  searchQuery,
  sortField,
  sortDirection,
  onToggleSort,
  formatCurrency,
  categoryLabel,
  statusLabel,
  onViewDetails,
  onToggleStatus,
  onDeleteAsset,
  page,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: ManagerAssetsRegisterTableProps) {
  const tManagerUi = useTranslations('manager.manager_assets.ui');
  const effectivePage = Math.min(page, Math.max(0, pageCount - 1));
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const renderSortableHeader = (
    field: AssetSortField,
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
              {renderSortableHeader('name', tManagerUi('asset_name'), 'left')}
              {renderSortableHeader('category', tManagerUi('category'), 'left')}
              {renderSortableHeader('purchaseDate', tManagerUi('purchase_date'), 'left')}
              {renderSortableHeader('purchaseValue', tManagerUi('purchase_value_inr'), 'right')}
              {renderSortableHeader('location', tManagerUi('location'), 'left')}
              {renderSortableHeader('status', tManagerUi('status'), 'left')}
              <th scope="col" className="text-right py-3 px-4">
                {tManagerUi('action') || 'Action'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCount === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center">
                  <ManagerAssetsRegisterEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon flex justify-center py-2">
                      <Package size={36} className="text-secondary/60" aria-hidden="true" />
                    </div>
                    <p className="fin-empty-state__title">
                      {searchQuery ? 'No assets matching your search query.' : tManagerUi('no_assets_found')}
                    </p>
                  </ManagerAssetsRegisterEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((a) => {
                const categoryColor =
                  a.category === 'Appliance'
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    : a.category === 'Electronics'
                    ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                    : a.category === 'Furniture'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

                return (
                  <tr
                    key={a.id}
                    className={`hover:bg-surface-hover/70 transition-colors group h-14 ${
                      a.status === 'disposed' ? 'opacity-65' : ''
                    }`}
                  >
                    {/* Asset Name */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary text-xs">{a.name}</span>
                        <span className="text-[10px] text-secondary font-mono">
                          ID: #{String(a.id).slice(-4)}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${categoryColor}`}
                      >
                        {categoryLabel(a.category)}
                      </span>
                    </td>

                    {/* Purchase Date */}
                    <td className="py-3 px-4 text-xs text-secondary whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-secondary/70 shrink-0" />
                        <span>{a.purchaseDate}</span>
                      </div>
                    </td>

                    {/* Purchase Cost */}
                    <td className="py-3 px-4 text-right font-semibold text-xs text-emerald-400 font-mono whitespace-nowrap">
                      {formatCurrency(a.purchaseValue)}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-xs text-secondary">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-secondary/70 shrink-0" />
                        <span className="truncate max-w-[140px]" title={a.location}>
                          {a.location}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          a.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : a.status === 'maintenance'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                        }`}
                      >
                        {a.status === 'active' ? (
                          <>
                            <CheckCircle2 size={12} aria-hidden="true" />
                            <span>{statusLabel(a.status)}</span>
                          </>
                        ) : a.status === 'maintenance' ? (
                          <>
                            <Wrench size={12} aria-hidden="true" />
                            <span>{statusLabel(a.status)}</span>
                          </>
                        ) : (
                          <>
                            <Archive size={12} aria-hidden="true" />
                            <span>{statusLabel(a.status)}</span>
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
                            onClick={() => onViewDetails(a)}
                            className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 transition-colors cursor-pointer"
                            title="View Asset Details"
                            aria-label={`View details for ${a.name}`}
                          >
                            <Eye size={15} />
                          </button>
                        )}

                        {/* Status Toggle Button */}
                        {onToggleStatus && a.status !== 'disposed' && (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(a)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                              a.status === 'active'
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40'
                            }`}
                            title={
                              a.status === 'active'
                                ? 'Send asset for maintenance'
                                : 'Mark asset as active & operational'
                            }
                          >
                            {a.status === 'active' ? (
                              <>
                                <Wrench size={12} />
                                <span>Service</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={12} />
                                <span>Restore</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Delete Button */}
                        {onDeleteAsset && (
                          <button
                            type="button"
                            onClick={() => onDeleteAsset(a.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition-colors cursor-pointer"
                            title="Remove asset"
                            aria-label={`Delete ${a.name}`}
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
            {onPageSizeChange && (
              <div className="flex items-center gap-1.5">
                <label htmlFor="rows-per-page-assets-register" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="rows-per-page-assets-register"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}

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

export default ManagerAssetsRegisterTable;
