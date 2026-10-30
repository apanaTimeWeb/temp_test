// RESPONSIBILITY: AdminSystemBackupsHistorySection component owned by admin_system; responsibility folder: admin_system_backups_page_view_sections.
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import type useBackupsPage from '@/app/frontend_admin/admin_system/system_backups/hooks/useAdminSystemBackupsPage';
import { Database, Download, RefreshCw } from 'lucide-react';
import { ADMIN_SYSTEM_BACKUP_STATUS_CONFIG as STATUS_CFG } from '@/app/frontend_admin/admin_system/system_backups/config/admin_system_backups.url_config';
import type { AdminSystemBackupsHistorySectionProps } from '@/app/frontend_admin/admin_system/system_backups/types/AdminSystemBackupsTypes';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';


export default function AdminSystemBackupsHistorySection({ model }: AdminSystemBackupsHistorySectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { backups } = model;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const paginatedBackups = useMemo(
    () => backups.slice(page * pageSize, (page + 1) * pageSize),
    [backups, page, pageSize]
  );
  return (
    <>
      {/* Backup History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('BACKUP_HISTORY')}</CardTitle>
              <CardDescription>{t('BACKUP_HISTORY_DESCRIPTION')}</CardDescription>
            </div>
            <Button id="refresh-backups-btn" variant="ghost" size="sm" disabled title={t('BACKUP_REFRESH_UNAVAILABLE')}>
              <RefreshCw size={18} strokeWidth={2} /> {t('REFRESH')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p id="backup-actions-unavailable-note" role="status" className="mb-3 text-xs text-text-secondary">{t('BACKUP_ACTIONS_UNAVAILABLE')}</p>
          <div className="space-y-3 md:hidden">
            {backups.map((backup) => {
              const cfg = STATUS_CFG[backup.status];
              const Icon = cfg.icon;
              return (
                <article key={backup.id} className="rounded-lg border border-border bg-card p-4 space-y-3" aria-label={backup.name}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2"><Database size={18} strokeWidth={2} className="shrink-0 text-text-secondary" /><p className="break-words font-medium text-text-primary">{backup.name}</p></div>
                    <AdminSystemBadge variant={cfg.variant}><Icon size={18} strokeWidth={2} />{cfg.label}</AdminSystemBadge>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-xs text-text-secondary">{t('TYPE')}</dt><dd className="text-text-primary">{backup.type === 'auto' ? t('AUTO') : t('MANUAL')}</dd></div>
                    <div><dt className="text-xs text-text-secondary">{t('SIZE')}</dt><dd className="text-text-secondary">{backup.size}</dd></div>
                    <div className="col-span-2"><dt className="text-xs text-text-secondary">{t('CREATED_AT')}</dt><dd className="text-text-secondary">{backup.createdAt}</dd></div>
                    <div className="col-span-2"><dt className="text-xs text-text-secondary">{t('INCLUDES')}</dt><dd className="flex flex-wrap gap-1 pt-1">{backup.modules.map((module) => <span key={module} className="rounded bg-surface-highlight px-1.5 py-0.5 text-xs text-text-secondary">{module}</span>)}</dd></div>
                  </dl>
                  <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                    {backup.status === 'success' && <Button variant="ghost" size="sm" disabled aria-label={t('BACKUP_DOWNLOAD_BLOCKED', { id: backup.id })} aria-describedby="backup-actions-unavailable-note" title={t('BACKUP_ACTIONS_UNAVAILABLE')}><Download size={18} strokeWidth={2} />{t('DOWNLOAD')}</Button>}
                    <Button variant="ghost" size="sm" disabled aria-label={t('BACKUP_DELETE_BLOCKED', { id: backup.id })} aria-describedby="backup-actions-unavailable-note" title={t('BACKUP_ACTIONS_UNAVAILABLE')}>{t('DELETE')}</Button>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-max text-sm text-left">
              <thead>
                <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                  <th scope="col" className="sticky left-0 z-10 bg-surface-highlight text-left py-3 px-4">{t('BACKUP_NAME')}</th>
                  <th className="text-left py-3 px-4">{t('TYPE')}</th>
                  <th className="text-left py-3 px-4">{t('SIZE')}</th>
                  <th className="text-left py-3 px-4">{t('CREATED_AT')}</th>
                  <th className="text-left py-3 px-4">{t('STATUS')}</th>
                  <th className="text-left py-3 px-4">{t('INCLUDES')}</th>
                  <th className="text-left py-3 px-4">{t('ACTIONS')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBackups.map(backup => {
                  const cfg = STATUS_CFG[backup.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={backup.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra/30">
                      <td className="sticky left-0 z-[1] bg-inherit py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Database size={18} strokeWidth={2} className="text-text-secondary" />
                          <span className="font-medium text-primary">{backup.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <AdminSystemBadge variant={backup.type === 'auto' ? 'primary' : 'outline'}>
                          {backup.type === 'auto' ? t('AUTO') : t('MANUAL')}
                        </AdminSystemBadge>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-text-secondary">{backup.size}</td>
                      <td className="py-3 px-4 text-text-secondary text-xs">{backup.createdAt}</td>
                      <td className="py-3 px-4">
                        <AdminSystemBadge variant={cfg.variant}>
                          <Icon size={18} strokeWidth={2} className={backup.status === 'in-progress' ? 'motion-safe:animate-spin' : ''} />
                          {cfg.label}
                        </AdminSystemBadge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {backup.modules.slice(0, 3).map(m => (
                            <span key={m} className="text-micro px-1.5 py-0.5 rounded bg-card text-text-secondary">{m}</span>
                          ))}
                          {backup.modules.length > 3 && (
                            <span className="text-micro px-1.5 py-0.5 rounded bg-card text-text-secondary">+{backup.modules.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {backup.status === 'success' && (
                            <Button data-testid="admin_system-AdminSystemBackupsPageView-control-003"
                              id={`download-backup-${backup.id}`}
                              variant="ghost"
                              size="sm"
                              disabled
                              aria-label={t('BACKUP_DOWNLOAD_BLOCKED', { id: backup.id })}
                              aria-describedby="backup-actions-unavailable-note"
                              title={t('BACKUP_ACTIONS_UNAVAILABLE')}
                            >
                              <Download size={18} strokeWidth={2} />
                            </Button>
                          )}
                          <Button data-testid="admin_system-AdminSystemBackupsPageView-control-004"
                            id={`delete-backup-${backup.id}`}
                            variant="ghost"
                            size="sm"
                            className="text-danger-text hover:bg-danger-bg"
                            disabled
                            aria-label={t('BACKUP_DELETE_BLOCKED', { id: backup.id })}
                            aria-describedby="backup-actions-unavailable-note"
                            title={t('BACKUP_ACTIONS_UNAVAILABLE')}
                          >
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {backups.length > 0 && (
              <AdminTablePagination
                page={page}
                pageSize={pageSize}
                totalCount={backups.length}
                onPageChange={setPage}
                onPageSizeChange={(newSize: number) => {
                  setPageSize(newSize);
                  setPage(0);
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
