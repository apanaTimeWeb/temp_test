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
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, Building2, CalendarDays, CheckCircle2, Clock, Cpu, Eye, MapPin, ShieldCheck, Tag, Wrench} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo,useState } from 'react';

interface Props {
  records: AdminAssetRecord[];
  onManageAmc: (asset: AdminAssetRecord) => void;
  onViewDetail?: (asset: AdminAssetRecord) => void;
  onResetFilters: () => void;
}

export function AdminAssetsRegisterTable({
  records,
  onManageAmc,
  onViewDetail,
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
            <ArrowUpDown className="text-muted-foreground/40 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (records.length === 0) {
    return <AdminAssetsRegisterEmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse" aria-label={t('TITLE')}>
          <thead>
            <tr className="border-b border-border bg-surface-muted text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
          <tbody className="divide-y divide-border text-foreground">
            {paginatedRecords.map((asset) => {
              const expiringSoon = isExpiringSoon(asset.warrantyExpiryDate);
              const daysLeft = getDaysUntilExpiry(asset.warrantyExpiryDate);

              return (
                <tr
                  key={asset.id}
                  className="hover:bg-surface-hover/60 transition-colors group cursor-pointer"
                  onClick={() => onViewDetail && onViewDetail(asset)}
                >
                  {/* Asset & Code */}
                  <td className="px-4 py-3.5 min-w-[220px]">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                        <Cpu className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
                          {asset.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="font-mono px-2 py-0.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-semibold">
                            {asset.assetCode}
                          </span>
                          {asset.serialNumber && (
                            <span className="font-mono text-muted-foreground text-[10px]">
                              SN: {asset.serialNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Branch & Location */}
                  <td className="px-4 py-3.5 whitespace-nowrap min-w-[170px]">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-emerald-400 shrink-0" />
                      <span className="font-bold text-foreground text-xs">{asset.branchName}</span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-text-secondary">
                      <MapPin size={11} className="text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[160px]" title={asset.locationWithinBranch}>
                        {asset.locationWithinBranch}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-primary shadow-2xs">
                      <Tag size={12} className="text-indigo-400 shrink-0" />
                      {t(`CATEGORIES.${asset.category}`)}
                    </span>
                  </td>

                  {/* Purchase Date & Cost */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <p className="font-mono font-bold text-foreground text-sm">
                      {formatPaiseToRupees(asset.purchaseCost)}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatAssetDate(asset.purchaseDate)}
                    </p>
                    {asset.currentBookValue && (
                      <p className="text-[10px] text-text-muted mt-0.5">
                        Book: {formatPaiseToRupees(asset.currentBookValue)}
                      </p>
                    )}
                  </td>

                  {/* Warranty Expiry */}
                  <td className="px-4 py-3.5 whitespace-nowrap min-w-[140px]">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-muted-foreground" />
                      <span className="font-mono text-xs text-foreground font-medium">
                        {formatAssetDate(asset.warrantyExpiryDate)}
                      </span>
                    </div>
                    <div className="mt-1">
                      {expiringSoon ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                          <Clock className="h-3 w-3" />
                          Expires in {daysLeft}d
                        </span>
                      ) : daysLeft !== null && daysLeft < 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Valid
                        </span>
                      )}
                    </div>
                  </td>

                  {/* AMC Protection Status */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    {asset.amcStatus === 'ACTIVE_AMC' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400 shadow-2xs">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        <span>{t('AMC_STATUS.ACTIVE_AMC')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'UNDER_WARRANTY' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/15 px-2.5 py-1 text-xs font-semibold text-sky-400 shadow-2xs">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        <span>{t('AMC_STATUS.UNDER_WARRANTY')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'EXPIRED_NO_AMC' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-400 shadow-2xs">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>{t('AMC_STATUS.EXPIRED_NO_AMC')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'NOT_APPLICABLE' && (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>

                  {/* Vendor & Contact */}
                  <td className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">
                    <p className="font-bold text-foreground text-xs">{asset.vendorName}</p>
                    <span className="mt-1 block text-[11px] font-mono text-muted-foreground">{asset.vendorContact}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                        asset.status === 'OPERATIONAL'
                          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                          : asset.status === 'MAINTENANCE_REQUIRED' || asset.status === 'UNDER_REPAIR'
                          ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {asset.status === 'OPERATIONAL'
                        ? 'Operational'
                        : asset.status === 'MAINTENANCE_REQUIRED'
                        ? 'Maintenance Req.'
                        : asset.status === 'UNDER_REPAIR'
                        ? 'Under Repair'
                        : 'Disposed'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewDetail) onViewDetail(asset);
                        }}
                        title="View Asset Specification Card"
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-surface p-1.5 text-primary hover:bg-surface-hover hover:border-primary/40 transition-colors shadow-2xs"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onManageAmc(asset);
                        }}
                        title={t('ACTIONS.MANAGE_AMC')}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-surface p-1.5 text-amber-400 hover:bg-surface-hover hover:border-amber-500/40 transition-colors shadow-2xs"
                      >
                        <Wrench size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border p-4 bg-surface-muted/40">
        <AdminTablePagination
          page={page}
          pageSize={pageSize}
          totalRows={sortedRecords.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}

export default AdminAssetsRegisterTable;
