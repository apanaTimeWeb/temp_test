'use client';
// RESPONSIBILITY: AdminSystemBackupsConfigurationSection owns backup schedule and cloud-sync configuration UI.
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Cloud, Clock, HardDrive, Shield } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import Card from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import CardHeader from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardHeader';
import CardTitle from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import CardDescription from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardDescription';
import CardContent from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardContent';
import CardFooter from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardFooter';
import { Button } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { AdminSystemSwitch } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveSwitch';
import useAdminSystemBackupsUnsavedChangesGuard from '@/app/frontend_admin/admin_system/system_backups/hooks/useAdminSystemBackupsUnsavedChangesGuard';
import type { AdminSystemBackupsConfigurationSectionProps } from '@/app/frontend_admin/admin_system/system_backups/types/AdminSystemBackupsTypes';

export default function AdminSystemBackupsConfigurationSection({ model, isDemoMode, form, handleSaveConfig }: AdminSystemBackupsConfigurationSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const router = useRouter();
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const handleBlockedNavigation = useCallback((href: string) => { setPendingHref(href); setShowDiscardDialog(true); }, []);
  useAdminSystemBackupsUnsavedChangesGuard(form.formState.isDirty, handleBlockedNavigation, form.formState.isSubmitting);
  const discardDraft = () => { const destination = pendingHref; form.reset(); setPendingHref(null); setShowDiscardDialog(false); if (destination) router.push(destination); };
  const { autoBackup, setAutoBackup, cloudSync, setCloudSync, backupTime, retention } = model;
  return (
    <>
    <form onSubmit={handleSaveConfig} className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
            {/* Auto Backup Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock size={18} strokeWidth={2} className="text-primary" /> {t('AUTO_BACKUP_SCHEDULE')}
                </CardTitle>
                <CardDescription>{t('BACKUP_SCHEDULE_DESCRIPTION')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t('ENABLE_NIGHTLY_BACKUPS')}</p>
                    <p className="text-xs text-text-secondary">{t('NIGHTLY_BACKUP_HELP')}</p>
                  </div>
                  <AdminSystemSwitch id="auto-backup-toggle" aria-label={t('ENABLE_AUTOMATIC_BACKUPS_ARIA')} checked={autoBackup} onCheckedChange={setAutoBackup} disabled={!isDemoMode} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="backup-time" className="text-sm font-medium text-text-secondary">{t('BACKUP_TIME')}</label>
                  <div className="flex items-center gap-3">
                    <input
                      id="backup-time"
                      type="time"
                      {...form.register('backupTime')}
                      disabled={!autoBackup || !isDemoMode}
                      className="px-3 py-2 rounded-lg bg-card border border-border text-sm text-text-primary focus:outline-none focus:border-primary disabled:opacity-40"
                    />
                    <span className="text-sm text-text-secondary">{t('DAILY_AT')} {backupTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="retention-days" className="text-sm font-medium text-text-secondary">{t('RETENTION_PERIOD')}</label>
                  <div className="flex items-center gap-3">
                    <input
                      id="retention-days"
                      type="number"
                      disabled={!isDemoMode}
                      {...form.register('retention', { valueAsNumber: true })}
                      min={7}
                      max={365}
                      className="w-24 px-3 py-2 rounded-lg bg-card border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                    />
                    <span className="text-sm text-text-secondary">{t('OLD_BACKUPS_DELETED_AFTER')} {retention} {t('DAYS')}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-backup-schedule-btn" variant="primary" type="submit" disabled={!isDemoMode}>{t('SAVE_SCHEDULE')}</Button>
              </CardFooter>
            </Card>

            {/* Cloud Sync */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud size={18} strokeWidth={2} className="text-primary" /> {t('CLOUD_SYNC')}
                </CardTitle>
                <CardDescription>{t('CLOUD_SYNC_DESCRIPTION')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{t('ENABLE_CLOUD_SYNC')}</p>
                    <p className="text-xs text-text-secondary">{t('AUTO_UPLOAD_BACKUPS')}</p>
                  </div>
                  <AdminSystemSwitch id="cloud-sync-toggle" aria-label={t('ENABLE_CLOUD_SYNC_ARIA')} checked={cloudSync} onCheckedChange={setCloudSync} disabled={!isDemoMode} />
                </div>

                {isDemoMode && cloudSync && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="cloud-provider" className="text-sm font-medium text-text-secondary">{t('CLOUD_PROVIDER')}</label>
                      <select id="cloud-provider" {...form.register('cloudProvider')} data-testid="admin_system-AdminSystemBackupsPageView-control-002" className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-text-primary focus:outline-none focus:border-primary">
                        <option>{t('GOOGLE_DRIVE')}</option>
                        <option>{t('AWS_S3')}</option>
                        <option>{t('DROPBOX')}</option>
                        <option>{t('CUSTOM_S3')}</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-success-bg border border-success-text">
                      <div className="h-8 w-8 rounded-full bg-success-bg flex items-center justify-center">
                        <Shield size={18} strokeWidth={2} className="text-success-text" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-success-text">{t('DEMO_CLOUD_STATUS')}</p>
                        <p className="text-xs text-text-secondary">{t('LAST_SYNCED_SAMPLE')}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Storage usage */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span className="flex items-center gap-1"><HardDrive size={18} strokeWidth={2} /> {t('LOCAL_STORAGE_USED')}</span>
                    <span className="text-primary font-semibold">{isDemoMode ? '28.4 MB / 500 MB' : 'Not connected'}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-card overflow-hidden">
                    <div className="h-full w-[5.68%] rounded-full bg-primary motion-safe:transition-[width] motion-safe:duration-base" />
                  </div>
                  <p className="text-xs text-text-secondary">{t('STORAGE_REMAINING_SAMPLE')}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button id="save-cloud-config-btn" variant="primary" type="button" disabled title={t('CLOUD_CONFIG_UNAVAILABLE')}>{t('SAVE_CLOUD_CONFIG')}</Button>
                <Button id="test-cloud-connection-btn" variant="ghost" type="button" disabled title={t('CONNECTION_TEST_UNAVAILABLE')}>{t('TEST_CONNECTION')}</Button>
                <p role="status" className="text-xs text-text-secondary">{t('CLOUD_CONFIG_UNAVAILABLE')}</p>
              </CardFooter>
            </Card>
      </form>
      <Dialog open={showDiscardDialog} onOpenChange={(open) => { if (!open) { setShowDiscardDialog(false); setPendingHref(null); } }}>
        <DialogContent className="space-y-4">
          <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
          <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
          <DialogFooter>
            <button type="button" className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => { setShowDiscardDialog(false); setPendingHref(null); }}>{t('UNSAVED_CHANGES_STAY')}</button>
            <button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={discardDraft}>{t('UNSAVED_CHANGES_LEAVE')}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
