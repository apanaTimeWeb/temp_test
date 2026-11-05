'use client';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import { ManagerAssetsRegisterEmptyState } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_empty_states/ManagerAssetsRegisterEmptyState';

export type AssetSortField = 'name' | 'category' | 'purchaseDate' | 'purchaseValue' | 'location' | 'status';

const STATUS_BADGE: Record<string, string> = {
  active: 'fin-badge--success',
  maintenance: 'fin-badge--warning',
  disposed: 'fin-badge--neutral',
};

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
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (newPage: number) => void;
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
  page,
  pageSize,
  pageCount,
  onPageChange,
}: ManagerAssetsRegisterTableProps) {
  const tManagerUi = useTranslations('manager.manager_assets.ui');
  const effectivePage = Math.min(page, pageCount - 1);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const renderSortableHeader = (field: AssetSortField, label: string, align: 'left' | 'right' = 'left') => {
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
            {renderSortableHeader('name', tManagerUi('asset_name'))}
            {renderSortableHeader('category', tManagerUi('category'))}
            {renderSortableHeader('purchaseDate', tManagerUi('purchase_date'))}
            {renderSortableHeader('purchaseValue', tManagerUi('purchase_value_inr'), 'right')}
            {renderSortableHeader('location', tManagerUi('location'))}
            {renderSortableHeader('status', tManagerUi('status'))}
          </tr>
        </thead>
        <tbody>
          {filteredCount === 0 ? (
            <tr>
              <td colSpan={6}>
                <ManagerAssetsRegisterEmptyState className="fin-empty-state">
                  <div className="fin-empty-state__icon">🏷️</div>
                  <p className="fin-empty-state__title">
                    {searchQuery ? 'No assets matching your search query.' : tManagerUi('no_assets_found')}
                  </p>
                </ManagerAssetsRegisterEmptyState>
              </td>
            </tr>
          ) : (
            paginated.map((a) => (
              <tr
                key={a.id}
                className={`fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12 ${
                  a.status === 'disposed' ? 'opacity-50' : ''
                }`}
              >
                <td className="py-3 px-4 fin-cell-name font-semibold">{a.name}</td>
                <td className="py-3 px-4">
                  <span className="fin-badge fin-badge--neutral">{categoryLabel(a.category)}</span>
                </td>
                <td className="py-3 px-4 fin-cell-subtext">{a.purchaseDate}</td>
                <td className="py-3 px-4 text-right fin-cell-subtext font-mono font-bold text-primary">
                  {formatCurrency(a.purchaseValue)}
                </td>
                <td className="py-3 px-4 fin-cell-subtext">{a.location}</td>
                <td className="py-3 px-4">
                  <span className={`fin-badge ${STATUS_BADGE[a.status]}`}>{statusLabel(a.status)}</span>
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={effectivePage === 0}
              onClick={() => onPageChange(effectivePage - 1)}
              className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs">
              Page {effectivePage + 1} of {pageCount}
            </span>
            <button
              type="button"
              disabled={effectivePage >= pageCount - 1}
              onClick={() => onPageChange(effectivePage + 1)}
              className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

