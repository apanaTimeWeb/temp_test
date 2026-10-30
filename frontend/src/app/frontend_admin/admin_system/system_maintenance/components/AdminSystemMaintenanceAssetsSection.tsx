// RESPONSIBILITY: AdminSystemMaintenanceAssetsSection component owned by admin_system; responsibility folder: admin_system_maintenance_page_sections.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { Package } from 'lucide-react';
import type { AdminSystemMaintenanceAssetFixture } from '@/app/frontend_admin/admin_system/system_maintenance/mocks/AdminSystemMaintenanceFixtures';
import type { AdminSystemMaintenanceAssetsSectionProps } from '@/app/frontend_admin/admin_system/system_maintenance/types/AdminSystemMaintenanceComponentTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';


export default function AdminSystemMaintenanceAssetsSection({ assets }: AdminSystemMaintenanceAssetsSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_MAINTENANCE');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const paginatedAssets = useMemo(
    () => assets.slice(page * pageSize, (page + 1) * pageSize),
    [assets, page, pageSize]
  );
  const statusLabel = (status: AdminSystemMaintenanceAssetFixture['status']) => status === 'OK' ? 'STATUS_OK' : status === 'Due Soon' ? 'STATUS_DUE_SOON' : 'STATUS_OVERDUE';
  const statusVariant = (status: AdminSystemMaintenanceAssetFixture['status']) => status === 'OK' ? 'success' : status === 'Due Soon' ? 'warning' : 'danger';
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-text-primary"><Package size={18} strokeWidth={2} className="text-primary" /> {t('ASSETS')}</CardTitle>
        <CardDescription>{t('ASSET_DESCRIPTION')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:hidden" aria-label={t('ASSETS')}>
          {assets.map((asset) => <article key={asset.nameKey} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-semibold text-text-primary">{t(asset.nameKey)}</h3><AdminSystemBadge variant={statusVariant(asset.status)}>{t(statusLabel(asset.status))}</AdminSystemBadge></div>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-text-secondary">{t('QUANTITY')}</dt><dd className="text-text-primary">{asset.qty}</dd></div>
              <div><dt className="text-text-secondary">{t('LAST_SERVICED')}</dt><dd className="text-text-primary">{asset.lastServiced}</dd></div>
              <div><dt className="text-text-secondary">{t('NEXT_DUE')}</dt><dd className="text-text-primary">{asset.nextDue}</dd></div>
              <div><dt className="text-text-secondary">{t('DAYS_OVERDUE')}</dt><dd>{asset.daysOverdue > 0 ? <AdminSystemBadge variant="danger">+{asset.daysOverdue}{t('DAYS_OVERDUE_SUFFIX')}</AdminSystemBadge> : <span className="text-text-secondary">{Math.abs(asset.daysOverdue)}{t('DAYS_LEFT_SUFFIX')}</span>}</dd></div>
            </dl>
            <Button id={`log-asset-service-mobile-${asset.nameKey}`} className="mt-3" variant="ghost" size="sm" disabled title={t('ACTION_BLOCKED')}>{t('LOG_SERVICE_DEMO')}</Button>
          </article>)}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-max text-sm text-left">
            <thead>
              <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                <th scope="col" className="sticky left-0 z-10 bg-surface-highlight py-3 px-4 text-left">{t('ASSET')}</th>
                <th scope="col" className="py-3 px-4 text-center">{t('QUANTITY')}</th>
                <th scope="col" className="py-3 px-4 text-left">{t('STATUS')}</th>
                <th scope="col" className="py-3 px-4 text-left">{t('LAST_SERVICED')}</th>
                <th scope="col" className="py-3 px-4 text-left">{t('NEXT_DUE')}</th>
                <th scope="col" className="py-3 px-4 text-left">{t('DAYS_OVERDUE')}</th>
                <th scope="col" className="py-3 px-4 text-left">{t('ACTION')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedAssets.map((asset) => (
                <tr key={asset.nameKey} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                  <td className="sticky left-0 z-[1] bg-inherit py-3 px-4 font-medium text-text-primary">{t(asset.nameKey)}</td>
                  <td className="py-3 px-4 text-center text-text-secondary">{asset.qty}</td>
                  <td className="py-3 px-4"><AdminSystemBadge variant={statusVariant(asset.status)}>{t(statusLabel(asset.status))}</AdminSystemBadge></td>
                  <td className="py-3 px-4 text-text-secondary">{asset.lastServiced}</td><td className="py-3 px-4 text-text-secondary">{asset.nextDue}</td>
                  <td className="py-3 px-4">{asset.daysOverdue > 0 ? <AdminSystemBadge variant="danger">+{asset.daysOverdue}{t('DAYS_OVERDUE_SUFFIX')}</AdminSystemBadge> : <span className="text-text-secondary text-xs">{Math.abs(asset.daysOverdue)}{t('DAYS_LEFT_SUFFIX')}</span>}</td>
                  <td className="py-3 px-4"><Button id={`log-asset-service-table-${asset.nameKey}`} variant="ghost" size="sm" disabled title={t('ACTION_BLOCKED')}>{t('LOG_SERVICE_DEMO')}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {assets.length > 0 && (
            <AdminTablePagination
              page={page}
              pageSize={pageSize}
              totalCount={assets.length}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(0);
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
}


export type { AdminSystemMaintenanceAssetsSectionProps };
