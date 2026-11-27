'use client';

import AdminAssetsRegisterEmptyState from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterEmptyState';
import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatAssetDate,
  formatPaiseToRupees,
  getDaysUntilExpiry,
  isExpiringSoon,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import {
  AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, Building2, CalendarDays,
  CheckCircle2, Clock, Cpu, Eye, MapPin, ShieldCheck, Tag, Wrench,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface Props {
  records: AdminAssetRecord[];
  onManageAmc: (asset: AdminAssetRecord) => void;
  onViewDetail?: (asset: AdminAssetRecord) => void;
  onResetFilters: () => void;
}

type AssetSortField = 'name' | 'branchName' | 'category' | 'purchaseCost' | 'warrantyExpiryDate' | 'amcStatus' | 'vendorName' | 'status';

const STATUS_BADGE: Record<string, string> = {
  OPERATIONAL: 'border-success bg-success-bg text-success-text',
  MAINTENANCE_REQUIRED: 'border-warning bg-warning-bg text-warning-text',
  UNDER_REPAIR: 'border-warning bg-warning-bg text-warning-text',
};

const STATUS_LABEL: Record<string, string> = {
  OPERATIONAL: 'Operational',
  MAINTENANCE_REQUIRED: 'Maintenance Req.',
  UNDER_REPAIR: 'Under Repair',
};

export function AdminAssetsRegisterTable({ records, onManageAmc, onViewDetail, onResetFilters }: Props) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER');
  const [sortField, setSortField] = useState<AssetSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const toggleSort = (field: AssetSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
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
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
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
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" /> : <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (records.length === 0) return <AdminAssetsRegisterEmptyState onResetFilters={onResetFilters} />;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse" aria-label={t('TITLE')}>
          <thead>
            <tr className="border-b border-border bg-surface-highlight text-xs font-semibold text-text-secondary uppercase tracking-wider">
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
          <tbody className="divide-y divide-border text-text-primary">
            {paginatedRecords.map((asset) => {
              const expiringSoon = isExpiringSoon(asset.warrantyExpiryDate);
              const daysLeft = getDaysUntilExpiry(asset.warrantyExpiryDate);
              return (
                <tr key={asset.id} className="hover:bg-surface-hover even:bg-surface-zebra motion-safe:transition-colors group">
                  <td className="px-4 py-3.5 min-w-[220px]">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-focus bg-primary-subtle text-primary shrink-0 mt-0.5">
                        <Cpu className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary text-sm leading-snug">{asset.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="font-mono px-2 py-0.5 rounded-md border border-border-focus bg-primary-subtle text-primary font-semibold">{asset.assetCode}</span>
                          {asset.serialNumber && <span className="font-mono text-text-secondary text-[10px]">SN: {asset.serialNumber}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap min-w-[170px]">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-success-text shrink-0" aria-hidden="true" />
                      <span className="font-bold text-text-primary text-xs">{asset.branchName}</span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-text-secondary">
                      <MapPin size={11} className="text-text-secondary shrink-0" aria-hidden="true" />
                      <span className="truncate max-w-[160px]" title={asset.locationWithinBranch}>{asset.locationWithinBranch}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-highlight px-2.5 py-1 text-xs font-semibold text-text-primary shadow-card">
                      <Tag size={12} className="text-primary shrink-0" aria-hidden="true" />
                      {t(`CATEGORIES.${asset.category}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <p className="font-mono font-bold text-text-primary text-sm">{formatPaiseToRupees(asset.purchaseCost)}</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">{formatAssetDate(asset.purchaseDate)}</p>
                    {asset.currentBookValue && <p className="text-[10px] text-text-secondary mt-0.5">Book: {formatPaiseToRupees(asset.currentBookValue)}</p>}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap min-w-[140px]">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-text-secondary" aria-hidden="true" />
                      <span className="font-mono text-xs text-text-primary font-medium">{formatAssetDate(asset.warrantyExpiryDate)}</span>
                    </div>
                    <div className="mt-1">
                      {expiringSoon ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-warning bg-warning-bg px-2 py-0.5 text-[10px] font-bold text-warning-text">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          Expires in {daysLeft}d
                        </span>
                      ) : daysLeft !== null && daysLeft < 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-danger bg-danger-bg px-2 py-0.5 text-[10px] font-semibold text-danger-text">Expired</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-success bg-success-bg px-2 py-0.5 text-[10px] font-semibold text-success-text">
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                          Valid
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    {asset.amcStatus === 'ACTIVE_AMC' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-1 text-xs font-semibold text-success-text shadow-card">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{t('AMC_STATUS.ACTIVE_AMC')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'UNDER_WARRANTY' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-info bg-info-bg px-2.5 py-1 text-xs font-semibold text-info-text shadow-card">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{t('AMC_STATUS.UNDER_WARRANTY')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'EXPIRED_NO_AMC' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-danger bg-danger-bg px-2.5 py-1 text-xs font-semibold text-danger-text shadow-card">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{t('AMC_STATUS.EXPIRED_NO_AMC')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'NOT_APPLICABLE' && <span className="text-text-secondary text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">
                    <p className="font-bold text-text-primary text-xs">{asset.vendorName}</p>
                    <span className="mt-1 block text-[11px] font-mono text-text-secondary">{asset.vendorContact}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${STATUS_BADGE[asset.status] ?? 'border-border bg-surface-highlight text-text-secondary'}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {STATUS_LABEL[asset.status] ?? 'Disposed'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewDetail && onViewDetail(asset)}
                        title="View Asset Specification Card"
                        aria-label={`View asset specification card for ${asset.name}`}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 text-primary hover:bg-surface-hover hover:border-border-focus motion-safe:transition-colors shadow-card"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onManageAmc(asset)}
                        title={t('ACTIONS.MANAGE_AMC')}
                        aria-label={`${t('ACTIONS.MANAGE_AMC')} for ${asset.name}`}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-card p-1.5 text-warning-text hover:bg-surface-hover hover:border-warning motion-safe:transition-colors shadow-card"
                      >
                        <Wrench size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border p-4 bg-surface-highlight">
        <AdminTablePagination page={page} pageSize={pageSize} totalRows={sortedRecords.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
    </div>
  );
}

export default AdminAssetsRegisterTable;
