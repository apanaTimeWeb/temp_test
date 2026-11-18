'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Wrench,
  Phone,
  Building2,
  Tag,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react';
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
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-indigo-400 font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-indigo-400 font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  if (records.length === 0) {
    return <AdminAssetsRegisterEmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse" aria-label={t('TITLE')}>
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {paginatedRecords.map((asset) => {
              const expiringSoon = isExpiringSoon(asset.warrantyExpiryDate);
              const daysLeft = getDaysUntilExpiry(asset.warrantyExpiryDate);

              return (
                <tr
                  key={asset.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* Asset & Code */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-bold text-white text-sm">{asset.name}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="font-mono px-1.5 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-semibold">
                        {asset.assetCode}
                      </span>
                      {asset.serialNumber && (
                        <span className="font-mono text-slate-400">SN: {asset.serialNumber}</span>
                      )}
                    </div>
                  </td>

                  {/* Branch & Location */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={13} className="text-emerald-400 shrink-0" />
                      <span className="font-semibold text-white">{asset.branchName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{asset.locationWithinBranch}</p>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                      <Tag size={11} className="text-indigo-400" />
                      {t(`CATEGORIES.${asset.category}`)}
                    </span>
                  </td>

                  {/* Purchase Date & Cost */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <p className="font-mono font-bold text-white text-sm">
                      {formatPaiseToRupees(asset.purchaseCost)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatAssetDate(asset.purchaseDate)}</p>
                  </td>

                  {/* Warranty Expiry */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-slate-400" />
                      <span className="font-mono text-slate-300">{formatAssetDate(asset.warrantyExpiryDate)}</span>
                    </div>
                    {expiringSoon ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                        <Clock className="h-3 w-3" />
                        Expires in {daysLeft}d
                      </span>
                    ) : daysLeft !== null && daysLeft < 0 ? (
                      <span className="mt-1 inline-flex text-[10px] text-slate-500 italic">Expired</span>
                    ) : null}
                  </td>

                  {/* AMC Protection Status */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    {asset.amcStatus === 'ACTIVE_AMC' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{t('AMC_STATUS.ACTIVE_AMC')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'UNDER_WARRANTY' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{t('AMC_STATUS.UNDER_WARRANTY')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'EXPIRED_NO_AMC' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>{t('AMC_STATUS.EXPIRED_NO_AMC')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'NOT_APPLICABLE' && (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* Vendor & Contact */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-semibold text-white">{asset.vendorName}</p>
                    <a
                      href={`tel:${asset.vendorContact}`}
                      className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-mono transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      <span>{asset.vendorContact}</span>
                    </a>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                        asset.status === 'OPERATIONAL'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : asset.status === 'MAINTENANCE_REQUIRED' || asset.status === 'UNDER_REPAIR'
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
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
                    <button
                      type="button"
                      onClick={() => onManageAmc(asset)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-indigo-500 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                    >
                      <Wrench size={13} className="text-indigo-400" />
                      <span>{t('ACTIONS.MANAGE_AMC')}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-800 p-4">
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
