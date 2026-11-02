// components/AdminAssetsRegisterTable.tsx
'use client';
import { useTranslations } from 'next-intl';
import { ShieldCheck, AlertTriangle, Clock, Wrench, Phone, CalendarClock } from 'lucide-react';
import type { AdminAssetRecord } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';
import {
  formatPaiseToRupees,
  formatAssetDate,
  isExpiringSoon,
  getDaysUntilExpiry,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/utils/AdminAssetsRegisterFormatters';
import AdminAssetsRegisterEmptyState from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterEmptyState';

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

  if (records.length === 0) {
    return <AdminAssetsRegisterEmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse" aria-label={t('TITLE')}>
          <thead>
            <tr className="border-b border-border bg-muted/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">{t('TABLE.ASSET')}</th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">{t('TABLE.BRANCH')}</th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">{t('TABLE.CATEGORY')}</th>
              <th scope="col" className="px-4 py-3.5 text-right whitespace-nowrap">{t('TABLE.PURCHASE')}</th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">{t('TABLE.WARRANTY_EXPIRY')}</th>
              <th scope="col" className="px-4 py-3.5 text-center whitespace-nowrap">{t('TABLE.AMC_STATUS')}</th>
              <th scope="col" className="px-4 py-3.5 whitespace-nowrap">{t('TABLE.VENDOR')}</th>
              <th scope="col" className="px-4 py-3.5 text-center whitespace-nowrap">{t('TABLE.STATUS')}</th>
              <th scope="col" className="px-4 py-3.5 text-center whitespace-nowrap">{t('TABLE.ACTIONS')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((asset) => {
              const expiringSoon = isExpiringSoon(asset.warrantyExpiryDate);
              const daysLeft = getDaysUntilExpiry(asset.warrantyExpiryDate);

              return (
                <tr
                  key={asset.id}
                  className="hover:bg-muted/30 motion-safe:transition-colors focus-within:bg-muted/40"
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
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400">
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
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success-text">
                        <ShieldCheck className="h-3 w-3" />
                        <span>{t('AMC_STATUS.ACTIVE_AMC')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'UNDER_WARRANTY' && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                        <ShieldCheck className="h-3 w-3" />
                        <span>{t('AMC_STATUS.UNDER_WARRANTY')}</span>
                      </span>
                    )}
                    {asset.amcStatus === 'EXPIRED_NO_AMC' && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/15 px-2.5 py-0.5 text-xs font-medium text-destructive">
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
    </div>
  );
}

export default AdminAssetsRegisterTable;

