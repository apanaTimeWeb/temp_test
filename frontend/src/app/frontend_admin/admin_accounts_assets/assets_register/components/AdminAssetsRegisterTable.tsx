// components/AdminAssetsRegisterTable.tsx
'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, AlertTriangle, Clock, Wrench, Phone, CalendarClock, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatPaiseToRupees,
  formatAssetDate,
  isExpiringSoon,
  getDaysUntilExpiry,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import AdminAssetsRegisterEmptyState from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterEmptyState';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

interface Props {
  records: AdminAssetRecord[];
  onManageAmc: (asset: AdminAssetRecord) => void;
  onResetFilters: () => void;
}

export function AdminAssetsRegisterTable({
  records,
  onManageAmc,
  onResetFilters,
}: Props) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER');
  type AssetSortField = 'name' | 'branchName' | 'category' | 'purchaseCost' | 'warrantyExpiryDate' | 'amcStatus' | 'vendorName' | 'status';
  const [sortField, setSortField] = useState<AssetSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: AssetSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = useMemo(() => {
    if (!sortField) return records;
    return [...records].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const diff = aVal - bVal;
        return sortDirection === 'asc' ? diff : -diff;
      }
      return 0;
    });
  }, [records, sortField, sortDirection]);

  const paginatedRecords = useMemo(
    () => sortedRecords.slice(page * pageSize, (page + 1) * pageSize),
    [sortedRecords, page, pageSize]
  );

  const renderSortableHeader = (field: AssetSortField, label: string, align: 'left' | 'right' | 'center' = 'left') => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`px-4 py-3.5 whitespace-nowrap ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (records.length === 0) {
    return <AdminAssetsRegisterEmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse" aria-label={t('TITLE')}>
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {renderSortableHeader('name', t('TABLE.ASSET'))}
              {renderSortableHeader('branchName', t('TABLE.BRANCH'))}
              {renderSortableHeader('category', t('TABLE.CATEGORY'))}
              {renderSortableHeader('purchaseCost', t('TABLE.PURCHASE'), 'right')}
              {renderSortableHeader('warrantyExpiryDate', t('TABLE.WARRANTY_EXPIRY'))}
              {renderSortableHeader('amcStatus', t('TABLE.AMC_STATUS'), 'center')}
              {renderSortableHeader('vendorName', t('TABLE.VENDOR'))}
              {renderSortableHeader('status', t('TABLE.STATUS'), 'center')}
              <th scope="col" className="px-4 py-3.5 text-center whitespace-nowrap">{t('TABLE.ACTIONS')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedRecords.map((asset) => {
              const expiringSoon = isExpiringSoon(asset.warrantyExpiryDate);
              const daysLeft = getDaysUntilExpiry(asset.warrantyExpiryDate);

              return (
                <tr
                  key={asset.id}
                  className="hover:bg-muted-hover motion-safe:transition-colors focus-within:bg-muted"
                >
                  {/* Asset & Code */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-semibold text-foreground">{asset.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-mono">{asset.assetCode}</span>
                      {asset.serialNumber && <span>· SN: {asset.serialNumber}</span>}
                    </div>
                  </td>

                  {/* Branch & Location */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-medium text-foreground">{asset.branchName}</p>
                    <p className="text-xs text-muted-foreground">{asset.locationWithinBranch}</p>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      {t(`CATEGORIES.${asset.category}`)}
                    </span>
                  </td>

                  {/* Purchase Date & Cost */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <p className="font-mono font-semibold text-foreground">
                      {formatPaiseToRupees(asset.purchaseCost)}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatAssetDate(asset.purchaseDate)}</p>
                  </td>

                  {/* Warranty Expiry */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-medium text-foreground">{formatAssetDate(asset.warrantyExpiryDate)}</p>
                    {expiringSoon ? (
                      <span className="inline-flex items-center gap-1 rounded bg-warning-bg px-1.5 py-0.5 text-[11px] font-bold text-warning-text">
                        <Clock className="h-3 w-3" />
                        <span>Expires in {daysLeft}d</span>
                      </span>
                    ) : daysLeft !== null && daysLeft < 0 ? (
                      <span className="text-xs text-muted-foreground italic">Expired</span>
                    ) : null}
                  </td>

                  {/* AMC Protection Status */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    {asset.amcStatus === 'ACTIVE_AMC' && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success-text">
                        <ShieldCheck className="h-3 w-3" />
                        <span>{t('AMC_STATUS.ACTIVE_AMC')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'UNDER_WARRANTY' && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-info">
                        <ShieldCheck className="h-3 w-3" />
                        <span>{t('AMC_STATUS.UNDER_WARRANTY')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'EXPIRED_NO_AMC' && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-destructive-bg px-2.5 py-0.5 text-xs font-medium text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{t('AMC_STATUS.EXPIRED_NO_AMC')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'NOT_APPLICABLE' && (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Vendor & Contact */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-medium text-foreground">{asset.vendorName}</p>
                    <a
                      href={`tel:${asset.vendorContact}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      <span>{asset.vendorContact}</span>
                    </a>
                  </td>

                  {/* Health Status */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    {asset.status === 'OPERATIONAL' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                        <span className="h-2 w-2 rounded-full bg-success" />
                        <span>{t('STATUS.OPERATIONAL')}</span>
                      </span>
                    )}
                    {asset.status === 'MAINTENANCE_REQUIRED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
                        <span className="h-2 w-2 rounded-full bg-warning" />
                        <span>{t('STATUS.MAINTENANCE_REQUIRED')}</span>
                      </span>
                    )}
                    {asset.status === 'UNDER_REPAIR' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                        <Wrench className="h-3 w-3" />
                        <span>{t('STATUS.UNDER_REPAIR')}</span>
                      </span>
                    )}
                    {asset.status === 'DISPOSED' && (
                      <span className="text-xs text-muted-foreground">{t('STATUS.DISPOSED')}</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onManageAmc(asset)}
                      title={t('ACTIONS.MANAGE_AMC')}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[32px] motion-safe:transition-colors"
                    >
                      <CalendarClock className="h-3.5 w-3.5 text-primary" />
                      <span>{t('ACTIONS.MANAGE_AMC')}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {records.length > 0 && (
        <AdminTablePagination
          page={page}
          pageSize={pageSize}
          totalCount={sortedRecords.length}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
          id="admin-assets-register-page-size"
        />
      )}
    </div>
  );
}

export default AdminAssetsRegisterTable;

