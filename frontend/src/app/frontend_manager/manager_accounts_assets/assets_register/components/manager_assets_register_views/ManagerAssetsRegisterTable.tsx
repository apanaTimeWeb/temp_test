'use client';

import { ManagerAssetsRegisterEmptyState } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_empty_states/ManagerAssetsRegisterEmptyState';
import { ManagerAssetsRegisterTablePagination } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_views/ManagerAssetsRegisterTablePagination';
import { ManagerAssetsRegisterTableRow } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_views/ManagerAssetsRegisterTableRow';
import type { ManagerAssetsRegisterAsset } from '@/app/frontend_manager/manager_accounts_assets/assets_register/hooks/ManagerAssetsRegisterDemoRepository';
import { ArrowDown, ArrowUp, ArrowUpDown, Package } from 'lucide-react';
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
              className="text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-colors shrink-0"
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
              paginated.map((a) => (
                <ManagerAssetsRegisterTableRow
                  key={a.id}
                  asset={a}
                  formatCurrency={formatCurrency}
                  categoryLabel={categoryLabel}
                  statusLabel={statusLabel}
                  onViewDetails={onViewDetails}
                  onToggleStatus={onToggleStatus}
                  onDeleteAsset={onDeleteAsset}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <ManagerAssetsRegisterTablePagination
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

export default ManagerAssetsRegisterTable;
